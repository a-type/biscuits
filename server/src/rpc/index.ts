import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter, createContext } from '@biscuits/trpc';
import * as deployedContext from '../config/deployedContext.js';
import { getLoginSession, setLoginSession } from '../auth/session.js';
import { db } from '@biscuits/db';
import { email } from '../services/email.js';
import { stripe } from '../services/stripe.js';
import { Server } from '@verdant-web/server';

export const createTrpcMiddleware = (verdant: Server) =>
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: async (opts) => {
      const session = await getLoginSession(opts.req);
      return createContext({
        ...opts,
        deployedContext: {
          apiHost: deployedContext.DEPLOYED_HOST,
          uiOrigin: deployedContext.UI_ORIGIN,
        },
        auth: {
          setLoginSession: setLoginSession.bind(null, opts.res),
        },
        db,
        verdant,
        email,
        session,
        stripe,
      });
    },
  });
