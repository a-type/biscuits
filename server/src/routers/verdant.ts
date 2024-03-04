import { Router } from 'itty-router';
import { verdantServer } from '../verdant/verdant.js';
import { ReplicaType, TokenProvider } from '@verdant-web/server';
import { VERDANT_SECRET } from '../config/secrets.js';
import { DEPLOYED_ORIGIN } from '../config/deployedContext.js';
import { BiscuitsError } from '@biscuits/error';
import { getLibraryName } from '@biscuits/libraries';
import { sessions } from '../auth/session.js';
import { isPlanInGoodStanding } from '../management/plans.js';

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

  if (!session.planId) {
    throw new BiscuitsError(BiscuitsError.Code.NoPlan);
  }

  // lookup library for user's plan and the app
  const ok = await isPlanInGoodStanding(session.planId);

  if (!ok) {
    throw new BiscuitsError(BiscuitsError.Code.SubscriptionInactive);
  }

  const libraryId = getLibraryName(session.planId, req.params.app);

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

  return new Response(JSON.stringify({ accessToken: token }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});
verdantRouter.all('/', verdantServer.handleFetch);
verdantRouter.all('/files/:fileId', verdantServer.handleFileFetch);
