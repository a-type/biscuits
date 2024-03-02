import { builder } from '../builder.js';

builder.mutationFields((t) => ({
  createPushSubscription: t.field({
    type: 'Boolean',
    args: {
      input: t.arg({
        type: 'CreatePushSubscriptionInput',
        required: true,
      }),
    },
    authScopes: {
      member: true,
    },
    resolve: async (parent, { input }, { db, session }) => {
      if (!session) {
        throw new Error('Not authenticated');
      }

      await db
        .insertInto('PushSubscription')
        .values({
          endpoint: input.endpoint,
          auth: input.auth,
          p256dh: input.p256dh,
          userId: session.userId,
        })
        .onConflict((cb) =>
          cb.column('endpoint').doUpdateSet({
            auth: input.auth,
            p256dh: input.p256dh,
            userId: session.userId,
          }),
        )
        .execute();

      return true;
    },
  }),

  deletePushSubscription: t.field({
    type: 'Boolean',
    args: {
      endpoint: t.arg({
        type: 'String',
        required: true,
      }),
    },
    authScopes: {
      member: true,
    },
    resolve: async (parent, { endpoint }, { db, session }) => {
      if (!session) {
        throw new Error('Not authenticated');
      }

      await db
        .deleteFrom('PushSubscription')
        .where('endpoint', '=', endpoint)
        .where('userId', '=', session.userId)
        .execute();

      return true;
    },
  }),
}));

builder.inputType('CreatePushSubscriptionInput', {
  fields: (t) => ({
    endpoint: t.string({ required: true }),
    auth: t.string({ required: true }),
    p256dh: t.string({ required: true }),
  }),
});
