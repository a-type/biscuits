import { Router } from 'itty-router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter, createContext } from '@biscuits/trpc';
import { verdantServer } from '../verdant/verdant.js';
import { db } from '@biscuits/db';
import { DEPLOYED_HOST, UI_ORIGIN } from '../config/deployedContext.js';
import { email } from '../services/email.js';
import { getLiveSession } from '@a-type/auth';

export const trpcRouter = Router({
  base: '/trpc',
});

trpcRouter.all('*', async (req) => {
  const res = new Response(null, {
    status: 200,
  });

  const session = await getLiveSession(req, res);

  return fetchRequestHandler({
    req,
    endpoint: '/trpc',
    router: appRouter,
    createContext: createContext({
      verdant: verdantServer,
      db: db,
      deployedContext: {
        apiHost: DEPLOYED_HOST,
        uiOrigin: UI_ORIGIN,
      },
      email: email,
      req,
      res,
      session,
    }),
  });
});
