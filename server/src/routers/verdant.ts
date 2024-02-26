import { Router } from 'itty-router';
import { verdantServer } from '../verdant/verdant.js';
import { ReplicaType, TokenProvider } from '@verdant-web/server';
import { VERDANT_SECRET } from '../config/secrets.js';
import { DEPLOYED_ORIGIN } from '../config/deployedContext.js';
import { db } from '@biscuits/db';
import { isSubscribed } from '../auth/subscription.js';
import { BiscuitsError } from '@biscuits/error';
import { getLibraryName } from '@biscuits/libraries';
import { sessions } from '../auth/session.js';

export const verdantRouter = Router({
  base: '/verdant',
});

const tokenProvider = new TokenProvider({
  secret: VERDANT_SECRET,
});

verdantRouter.get('/token/:app', async (req) => {
  const session = await sessions.getSession(req);

  if (!session) {
    throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
  }

  // lookup library for user's plan and the app
  const plan = await db
    .selectFrom('User')
    .leftJoin('Plan', 'Plan.id', 'User.planId')
    .select(['Plan.id', 'Plan.subscriptionStatus'])
    .where('User.id', '=', session.userId)
    .executeTakeFirst();

  if (!plan?.id) {
    throw new BiscuitsError(BiscuitsError.Code.NoPlan);
  }

  if (!isSubscribed(plan.subscriptionStatus)) {
    throw new BiscuitsError(BiscuitsError.Code.SubscriptionInactive);
  }

  const libraryId = getLibraryName(plan.id, req.params.app);

  const syncEndpoint = DEPLOYED_ORIGIN + '/verdant';
  const fileEndpoint = DEPLOYED_ORIGIN + '/verdant/files';

  const token = tokenProvider.getToken({
    userId: session?.userId,
    libraryId,
    syncEndpoint,
    role: 'user',
    type: ReplicaType.Realtime,
    expiresIn: '1d',
    fileEndpoint,
  });

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});
verdantRouter.all('/verdant', verdantServer.handleFetch);
verdantRouter.all('/verdant/files/:fileId', verdantServer.handleFileFetch);
