import { User as DBUser } from '@biscuits/db';
import { builder } from '../builder.js';
import { createResults, keyIndexes } from '../dataloaders/index.js';
import { assignTypeName, hasTypeName } from '../relay.js';
import { Plan } from './plan.js';
import { BiscuitsError } from '@biscuits/error';

builder.queryField('me', (t) =>
  t.field({
    type: 'User',
    nullable: false,
    resolve: async (_, __, ctx) => {
      if (!ctx.session?.userId) {
        throw new BiscuitsError(
          BiscuitsError.Code.Unauthorized,
          'Not logged in',
        );
      }

      const user = await ctx.db
        .selectFrom('User')
        .selectAll()
        .where('id', '=', ctx.session.userId)
        .executeTakeFirst();
      if (user) {
        return assignTypeName('User')(user);
      }

      throw new BiscuitsError(
        BiscuitsError.Code.Unexpected,
        'Could not access your account. Please contact support.',
      );
    },
  }),
);

builder.mutationFields((t) => ({
  setUserRole: t.node({
    authScopes: {
      productAdmin: true,
    },
    args: {
      userId: t.arg.globalID({
        required: true,
      }),
      role: t.arg({
        type: 'String',
        required: true,
      }),
    },
    id: async (_, { userId, role }, ctx) => {
      if (userId.typename !== 'User') {
        throw new Error('Invalid user');
      }

      if (role !== 'user' && role !== 'admin') {
        throw new Error('Invalid role');
      }

      const result = await ctx.db
        .updateTable('User')
        .set({
          planRole: role,
        })
        .where('id', '=', userId.id)
        .returning('id')
        .executeTakeFirst();

      if (!result) {
        throw new Error('User not found');
      }

      return { id: result.id, type: 'User' };
    },
  }),
}));

export const User = builder.loadableNodeRef('User', {
  load: async (ids, ctx) => {
    const users = await ctx.db
      .selectFrom('User')
      .selectAll()
      .where('id', 'in', ids as string[])
      .execute();

    const indexes = keyIndexes(ids);

    const results = createResults<DBUser & { __typename: 'User' }>(ids);
    for (const result of users) {
      results[indexes[result.id]] = assignTypeName('User')(result);
    }

    return results;
  },
  id: {
    resolve: (user) => user.id,
  },
});
User.implement({
  description: 'A user in the system',

  isTypeOf: hasTypeName('User'),
  fields: (t) => ({
    name: t.string({
      resolve: (user) => user.friendlyName || user.fullName || 'Anonymous',
    }),
    role: t.exposeString('planRole', {
      nullable: true,
    }),
    plan: t.field({
      type: Plan,
      nullable: true,
      resolve: (user) => user.planId,
    }),
    email: t.exposeString('email'),
    imageUrl: t.exposeString('imageUrl', {
      nullable: true,
    }),
  }),
});
