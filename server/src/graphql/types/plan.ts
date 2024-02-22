import { getLibraryName } from '@biscuits/libraries';
import { builder } from '../builder.js';
import { assignTypeName, hasTypeName } from '../relay.js';
import { User } from './user.js';
import { BiscuitsError } from '../../error.js';
import { id } from '@biscuits/db';

builder.queryField('plan', (t) =>
  t.field({
    type: Plan,
    nullable: true,
    resolve: async (_, __, ctx) => {
      if (ctx.session?.planId) {
        return ctx.session.planId;
      }
      return null;
    },
  }),
);

builder.queryField('plans', (t) =>
  t.connection({
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
);

builder.mutationFields((t) => ({
  createPlan: t.field({
    authScopes: {
      user: true,
    },
    type: 'CreatePlanResult',
    resolve: async (_, __, ctx) => {
      const userId = ctx.session?.userId;
      if (!userId) {
        throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
      }

      const plan = await ctx.db.transaction().execute(async (tx) => {
        const plan = await tx
          .insertInto('Plan')
          .values({
            id: id(),
            featureFlags: `{}`,
            name: 'New Plan',
          })
          .returning('id')
          .executeTakeFirstOrThrow();

        await tx
          .updateTable('User')
          .set({
            planId: plan.id,
            planRole: 'admin',
          })
          .where('id', '=', userId)
          .execute();

        return plan;
      });

      return { planId: plan.id, userId };
    },
  }),
  deletePlan: t.field({
    args: {
      id: t.arg.globalID({
        required: true,
      }),
    },
    type: 'Plan',
    authScopes: {
      productAdmin: true,
    },
    resolve: async (_, { id: { id, typename } }, ctx) => {
      if (typename !== 'Plan') {
        throw new BiscuitsError(BiscuitsError.Code.NotFound);
      }

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
}));

export const Plan = builder.loadableNodeRef('Plan', {
  load: async (ids, ctx) => {
    const results = await ctx.db
      .selectFrom('Plan')
      .selectAll()
      .where('id', 'in', ids as string[])
      .execute();

    return results.map(assignTypeName('Plan'));
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
      resolve: (plan) => plan.subscriptionStatus ?? 'inactive',
    }),
    subscriptionCanceledAt: t.expose('subscriptionCanceledAt', {
      nullable: true,
      type: 'DateTime',
    }),
    subscriptionExpiresAt: t.expose('subscriptionExpiresAt', {
      nullable: true,
      type: 'DateTime',
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
  }),
});

builder.objectType('CreatePlanResult', {
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
