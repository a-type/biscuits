import { getLibraryName } from '@biscuits/libraries';
import { builder } from '../builder.js';
import { assignTypeName, hasTypeName } from '../relay.js';
import { User } from './user.js';
import { BiscuitsError } from '../../error.js';
import {
  canPlanAcceptAMember,
  cancelPlan,
  removeUserFromPlan,
  setupNewPlan,
  updatePlanSubscription,
} from '../../management/plans.js';
import { assert } from '@a-type/utils';
import { logger } from '../../logger.js';
import { createResults, keyIndexes } from '../dataloaders/index.js';
import { Plan as DBPlan } from '@biscuits/db';
import { cacheSubscriptionInfoOnPlan } from '../../management/subscription.js';
import { email } from '../../services/email.js';
import { isSubscribed } from '../../auth/subscription.js';

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
          priceLookupKey: input.priceLookupKey,
          ctx,
        });
        planId = plan.id;
      } else {
        const plan = await setupNewPlan({
          userDetails,
          priceLookupKey: input.priceLookupKey,
          ctx,
        });
        planId = plan.id;
      }

      assert(!!planId, 'Plan ID not set during setupPlan');

      const newSession = {
        ...ctx.session,
        role: 'admin' as const,
        planId,
      };
      await ctx.auth.setLoginSession(newSession);

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
  kickMember: t.field({
    type: 'KickMemberResult',
    authScopes: {
      planAdmin: true,
    },
    args: {
      userId: t.arg.globalID({
        required: true,
      }),
    },
    resolve: async (_, { userId: { id } }, ctx) => {
      const planId = ctx.session?.planId;
      if (!planId) {
        throw new BiscuitsError(BiscuitsError.Code.NoPlan);
      }
      const removed = await removeUserFromPlan(planId, id, ctx);
      if (removed) {
        await email.sendMail({
          to: removed.email,
          subject: 'You have been removed from your Biscuits plan',
          text: `You have been removed from the Biscuits plan by an admin. If you believe this is a mistake, please contact support.`,
          html: `You have been removed from the Biscuits plan by an admin. If you believe this is a mistake, please contact support.`,
        });
      }
      return { planId };
    },
  }),
}));

export const Plan = builder.loadableNodeRef('Plan', {
  load: async (ids, ctx) => {
    // there's special auth logic here for loading plans for regular users -
    // a non-product-admin should never load anything but their own plan.

    // but there's one more thing... they might have been kicked from
    // their plan. so we need to validate their session planId with a real
    // planId in the database.

    // nobody without a session should be loading plans
    if (!ctx.session) {
      throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
    }

    let plans: DBPlan[];

    if (ctx.session?.isProductAdmin) {
      // no worries, just load them
      plans = await ctx.db
        .selectFrom('Plan')
        .selectAll()
        .where('id', 'in', ids as string[])
        .execute();
    } else {
      // if the user is not a product admin, they can only load their own plan
      if (ids.length !== 1) {
        logger.warn(`Non-admin user tried to load multiple plans`, {
          userId: ctx.session.userId,
          planIds: ids,
        });
        throw new BiscuitsError(BiscuitsError.Code.Unexpected);
      }
      const planId = ctx.session.planId;
      if (!planId) {
        return createResults<DBPlan & { __typename: 'Plan' }>(ids);
      }

      // find plan by user ID, not session plan ID
      const myPlan = await ctx.db
        .selectFrom('User')
        .innerJoin('Plan', 'Plan.id', 'User.planId')
        .selectAll('Plan')
        .where('User.id', '=', ctx.session.userId)
        .executeTakeFirst();

      if (!myPlan || myPlan.id !== planId) {
        // user session is invalid.
        throw new BiscuitsError(BiscuitsError.Code.SessionInvalid);
      }

      plans = [myPlan];
    }

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
    canSync: t.field({
      type: 'Boolean',
      resolve: async (plan, _, ctx) => {
        return isSubscribed(plan.subscriptionStatus);
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
      resolve: async (plan, _, ctx) => {
        if (plan.stripePriceId) {
          // this is gross, but the shared cache on stripe loaders
          // should at least mean it's not awful.
          const price = await ctx.dataloaders.stripePriceIdLoader.load(
            plan.stripePriceId,
          );
          if (!price?.lookup_key) return null;
          return {
            lookupKey: price.lookup_key,
          };
        }
        return null;
      },
    }),
    checkoutData: t.field({
      type: 'StripeCheckoutData',
      authScopes: {
        user: true,
      },
      nullable: true,
      resolve: async (plan, _, ctx) => {
        // only admins can complete checkout
        if (ctx.session?.role !== 'admin') return null;
        if (!plan.stripeSubscriptionId) return null;
        // can only complete checkout if subscription is incomplete or
        // if we haven't yet synced with Stripe
        if (
          plan.subscriptionStatus !== 'incomplete' &&
          plan.subscriptionStatus !== null
        ) {
          console.debug(
            'Subscription status is not incomplete. Cannot route to checkout.',
            {
              planId: plan.id,
              status: plan.subscriptionStatus,
            },
          );
          return null;
        }

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
        member: true,
      },
      nullable: true,
      args: {
        app: t.arg({
          type: 'String',
          required: true,
          description: 'The app to get library info for',
        }),
      },
      resolve: async (plan, { app }, ctx) => {
        const libraryName = getLibraryName(plan.id, app);
        const info = await ctx.verdant.getLibraryInfo(libraryName);
        if (
          !info ||
          (info.baselinesCount === 0 && info.operationsCount === 0)
        ) {
          return null;
        }
        return info;
      },
    }),
    pendingInvitations: t.field({
      type: ['PlanInvitation'],
      authScopes: {
        user: true,
      },
      resolve: async (plan, _, ctx) => {
        // only admins can see pending invitations
        if (ctx.session?.role !== 'admin') return [];

        const result = await ctx.db
          .selectFrom('PlanInvitation')
          .selectAll()
          .where('planId', '=', plan.id)
          .where('claimedAt', 'is', null)
          .execute();

        return result.map(assignTypeName('PlanInvitation'));
      },
    }),
    canInviteMore: t.field({
      type: 'Boolean',
      resolve: async (plan, _, ctx) => {
        return (await canPlanAcceptAMember(plan.id, ctx)).ok;
      },
    }),
    featureFlags: t.field({
      type: ['String'],
      resolve: async (plan) => {
        if (typeof plan.featureFlags === 'string') {
          try {
            const planFlags = JSON.parse(plan.featureFlags ?? '{}');
            return Object.keys(planFlags).filter((key) => planFlags[key]);
          } catch (err) {
            logger.warn('Error parsing plan feature flags', {
              planId: plan.id,
              featureFlags: plan.featureFlags,
              error: err,
            });
            return [];
          }
        } else {
          const flags = plan.featureFlags ?? [];
          if (!Array.isArray(flags)) {
            return [];
          }
          return flags;
        }
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
    priceLookupKey: t.string({
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

builder.objectType('KickMemberResult', {
  fields: (t) => ({
    plan: t.field({
      type: Plan,
      resolve: (result) => result.planId,
    }),
  }),
});
