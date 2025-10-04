import { isValidAppId } from '@biscuits/apps';
import { builder } from '../builder.js';
import { BiscuitsError } from '@biscuits/error';

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
        throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
      }
      if (!isValidAppId(input.appId)) {
        throw new BiscuitsError(BiscuitsError.Code.UnrecognizedApp);
      }

      await db
        .insertInto('PushSubscription')
        .values({
          endpoint: input.endpoint,
          auth: input.auth,
          p256dh: input.p256dh,
          userId: session.userId,
          appId: input.appId,
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
        throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
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
    appId: t.string({ required: true }),
    endpoint: t.string({ required: true }),
    auth: t.string({ required: true }),
    p256dh: t.string({ required: true }),
  }),
});
