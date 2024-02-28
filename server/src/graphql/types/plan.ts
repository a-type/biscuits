import { getLibraryName } from '@biscuits/libraries';
import { builder } from '../builder.js';
import { assignTypeName, hasTypeName } from '../relay.js';
import { User } from './user.js';
import { BiscuitsError } from '../../error.js';
import {
  cancelPlan,
  setupNewPlan,
  updatePlanSubscription,
} from '../../management/plans.js';
import { assert } from '@a-type/utils';
import { logger } from '../../logger.js';
import { stripeDateToDate } from '../../services/stripe.js';
import { createResults, keyIndexes } from '../dataloaders/index.js';
import { Plan as DBPlan } from '@biscuits/db';
import { cacheSubscriptionInfoOnPlan } from '../../management/subscription.js';

builder.queryFields((t) => ({
  plan: t.field({
    type: Plan,
    nullable: true,
    resolve: async (_, __, ctx) => {
      if (ctx.session?.planId) {
        return ctx.session.planId;
      }
      return null;
    },
  }),
  plans: t.connection({
    type: 'Plan',
    authScopes: {
      productAdmin: true,
    },
    resolve: async (_, { first, last, before, after }, ctx) => {
      let builder = ctx.db.selectFrom('Plan').selectAll('Plan');

      if (first || last) {
        const limit = (first ?? last ?? 0) + 1;
        builder = builder.limit(limit);
      }
      // cursor is ID
      if (before) {
        builder = builder.where('id', '<', before);
      }
      if (after) {
        builder = builder.where('id', '>', after);
      }

      const rawNodes = await builder.execute();
      const nodes = rawNodes
        .slice(0, first ?? last ?? 0)
        .map(assignTypeName('Plan'));

      return {
        // slice down to limit again
        edges: nodes.map((node) => ({
          cursor: node.id,
          node,
        })),
        pageInfo: {
          hasNextPage: rawNodes.length > nodes.length,
          hasPreviousPage: !!before,
          startCursor: nodes[0]?.id ?? null,
          endCursor: nodes[nodes.length - 1]?.id ?? null,
        },
      };
    },
  }),
}));

builder.mutationFields((t) => ({
  setupPlan: t.field({
    authScopes: {
      user: true,
    },
    type: 'SetupPlanResult',
    args: {
      input: t.arg({
        type: 'SetupPlanInput',
        required: true,
      }),
    },
    resolve: async (_, { input }, ctx) => {
      if (!ctx.session) {
        throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
      }
      const userId = ctx.session.userId;

      const userDetails = await ctx.db
        .selectFrom('User')
        .select(['id', 'email', 'planId', 'fullName', 'stripeCustomerId'])
        .where('id', '=', userId)
        .executeTakeFirst();

      if (!userDetails) {
        throw new BiscuitsError(
          BiscuitsError.Code.Unexpected,
          'User not found',
        );
      }

      let planId;
      if (userDetails?.planId) {
        // if existing plan has a subscription, change it
        // to use the new product. if not, just update the plan
        const plan = await updatePlanSubscription({
          userDetails,
          stripePriceId: input.stripePriceId,
          ctx,
        });
        planId = plan.id;
      } else {
        const plan = await setupNewPlan({
          userDetails,
          stripePriceId: input.stripePriceId,
          ctx,
        });
        planId = plan.id;
      }

      await ctx.auth.setLoginSession({
        ...ctx.session,
        planId,
      });

      return { planId, userId };
    },
  }),
  deletePlan: t.field({
    args: {
      id: t.arg.id(),
    },
    type: 'Plan',
    authScopes: {
      productAdmin: true,
    },
    resolve: async (_, { id }, ctx) => {
      const plan = await ctx.db
        .deleteFrom('Plan')
        .where('id', '=', `${id}`)
        .returningAll()
        .executeTakeFirst();

      if (!plan) {
        throw new Error('Plan not found');
      }

      return assignTypeName('Plan')(plan);
    },
  }),
  cancelPlan: t.field({
    authScopes: {
      planAdmin: true,
    },
    type: 'CancelPlanResult',
    resolve: async (_, __, ctx) => {
      if (!ctx.session) {
        throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
      }
      const userId = ctx.session.userId;

      if (!ctx.session.planId) {
        throw new BiscuitsError(BiscuitsError.Code.NoPlan);
      }

      await cancelPlan(ctx.session.planId, userId);

      return {};
    },
  }),
}));

export const Plan = builder.loadableNodeRef('Plan', {
  load: async (ids, ctx) => {
    const plans = await ctx.db
      .selectFrom('Plan')
      .selectAll()
      .where('id', 'in', ids as string[])
      .execute();

    // map results to key indexes
    const indexes = keyIndexes(ids);
    const results = createResults<DBPlan & { __typename: 'Plan' }>(ids);
    for (const plan of plans) {
      results[indexes[plan.id]] = assignTypeName('Plan')(plan);
    }

    return results;
  },
  id: {
    resolve: (plan) => plan.id,
  },
});

Plan.implement({
  description: 'A group of users with a subscription to a product',
  isTypeOf: hasTypeName('Plan'),
  fields: (t) => ({
    subscriptionStatus: t.string({
      resolve: async (plan, _, ctx) => {
        if (!plan.stripeSubscriptionId) return 'inactive';
        if (plan.subscriptionStatus) return plan.subscriptionStatus;
        // we don't have cached data - fetch it
        const subscription = await ctx.stripe.subscriptions.retrieve(
          plan.stripeSubscriptionId,
        );
        await cacheSubscriptionInfoOnPlan(subscription, ctx);
        return subscription.status;
      },
    }),
    subscriptionCanceledAt: t.expose('subscriptionCanceledAt', {
      nullable: true,
      type: 'DateTime',
    }),
    subscriptionExpiresAt: t.expose('subscriptionExpiresAt', {
      nullable: true,
      type: 'DateTime',
    }),
    productInfo: t.field({
      type: 'ProductInfo',
      nullable: true,
      resolve: (plan) =>
        plan.stripePriceId ? { priceId: plan.stripePriceId } : null,
    }),
    checkoutData: t.field({
      type: 'StripeCheckoutData',
      authScopes: {
        planAdmin: true,
      },
      nullable: true,
      resolve: async (plan, _, ctx) => {
        if (!plan.stripeSubscriptionId) return null;
        // can only complete checkout if subscription is incomplete or
        // if we haven't yet synced with Stripe
        if (
          plan.subscriptionStatus !== 'incomplete' &&
          plan.subscriptionStatus !== null
        )
          return null;
        const subscription = await ctx.stripe.subscriptions.retrieve(
          plan.stripeSubscriptionId,
          {
            expand: ['latest_invoice.payment_intent'],
          },
        );
        // double check
        if (subscription.status !== 'incomplete') {
          // changed since we last looked - let's store the new data.
          await cacheSubscriptionInfoOnPlan(subscription, ctx);
          return null;
        }

        assert(
          typeof subscription.latest_invoice !== 'string',
          'did not expand latest_invoice field',
        );
        assert(
          typeof subscription.latest_invoice?.payment_intent !== 'string',
          'did not expand latest_invoice.payment_intent field',
        );
        const clientSecret =
          subscription.latest_invoice?.payment_intent?.client_secret;

        if (!clientSecret) {
          logger.urgent('Stripe subscription does not have client secret', {
            subscriptionId: subscription.id,
            latestInvoice: subscription.latest_invoice,
            paymentIntent: subscription.latest_invoice?.payment_intent,
          });
          throw new BiscuitsError(
            BiscuitsError.Code.Unexpected,
            'Failed to begin the checkout process. This is unexpected. Please try again.',
          );
        }

        const subscriptionData = {
          subscriptionId: subscription.id,
          clientSecret,
        };
        return subscriptionData;
      },
    }),
    members: t.field({
      type: [User],
      nullable: false,
      resolve: async (plan, _, ctx) => {
        const users = await ctx.db
          .selectFrom('User')
          .select('id')
          .where('planId', '=', plan.id)
          .execute();
        return users.map(({ id }) => id);
      },
    }),
    libraryInfo: t.field({
      type: 'PlanLibraryInfo',
      authScopes: {
        productAdmin: true,
      },
      args: {
        app: t.arg({
          type: 'String',
          required: true,
          description: 'The app to get library info for',
        }),
      },
      resolve: (plan, { app }, ctx) => {
        return ctx.verdant.getLibraryInfo(getLibraryName(plan.id, app));
      },
    }),
    pendingInvitations: t.field({
      type: ['PlanInvitation'],
      authScopes: {
        planAdmin: true,
      },
      resolve: async (plan, _, ctx) => {
        const result = await ctx.db
          .selectFrom('PlanInvitation')
          .selectAll()
          .where('planId', '=', plan.id)
          .where('claimedAt', 'is', null)
          .execute();

        return result.map(assignTypeName('PlanInvitation'));
      },
    }),
  }),
});

builder.objectType('StripeCheckoutData', {
  fields: (t) => ({
    subscriptionId: t.exposeString('subscriptionId'),
    clientSecret: t.exposeString('clientSecret'),
  }),
});

builder.inputType('SetupPlanInput', {
  fields: (t) => ({
    stripePriceId: t.string({
      required: true,
    }),
  }),
});

builder.objectType('SetupPlanResult', {
  fields: (t) => ({
    user: t.field({
      type: User,
      resolve: (result) => result.userId,
    }),
    plan: t.field({
      type: Plan,
      resolve: (result) => result.planId,
    }),
  }),
});

builder.objectType('CancelPlanResult', {
  fields: (t) => ({
    user: t.field({
      type: User,
      nullable: true,
      resolve: (_, __, ctx) => ctx.session?.userId ?? null,
    }),
  }),
});
