import { Router } from 'itty-router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@biscuits/trpc';
import { verdantServer } from '../verdant/verdant.js';
import { db } from '@biscuits/db';
import { DEPLOYED_HOST, UI_ORIGIN } from '../config/deployedContext.js';
import { email } from '../services/email.js';
import { Session } from '@a-type/auth';
import { sessions } from '../auth/session.js';
import { stripe } from '../services/stripe.js';

export const trpcRouter = Router({
  base: '/trpc',
});

trpcRouter.all('*', async (req) => {
  const session = await sessions.getSession(req);

  let sessionHeaders: Record<string, string> = {};
  const auth = {
    setLoginSession: async (ses: Session | null) => {
      if (ses) {
        sessionHeaders = await sessions.updateSession(ses);
      } else {
        sessionHeaders = sessions.clearSession();
      }
    },
  };

  return fetchRequestHandler({
    req,
    endpoint: '/trpc',
    router: appRouter,
    responseMeta: () => {
      return {
        headers: sessionHeaders,
      };
    },
    createContext: () => ({
      verdant: verdantServer,
      db: db,
      deployedContext: {
        apiHost: DEPLOYED_HOST,
        uiOrigin: UI_ORIGIN,
      },
      email: email,
      req,
      session,
      auth,
      stripe,
    }),
  });
});
