import { verdantServer } from './verdant/verdant.js';
import { createServer } from 'http';
import { productAdminSetup } from './tasks/productAdminSetup.js';
import { ALLOWED_ORIGINS } from './config/cors.js';
import { PORT } from './config/deployedContext.js';
import { createServerAdapter } from '@whatwg-node/server';
import { error, AutoRouter, cors, IRequest } from 'itty-router';
import { authRouter } from './routers/auth.js';
import { migrateToLatest } from '@biscuits/db';
import { verdantRouter } from './routers/verdant.js';
import { BiscuitsError } from '@biscuits/error';
import { stripeRouter } from './routers/stripe.js';
import { graphqlRouter } from './routers/graphql.js';
import { writeSchema } from './tasks/writeSchema.js';
import { AuthError } from '@a-type/auth';
import { killPortProcess } from 'kill-port-process';
import { gnocchiRouter } from './routers/gnocchi.js';

console.log('Starting server...');

const { preflight, corsify } = cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
});

const router = AutoRouter({
  before: [preflight],
  finally: [corsify],
  catch: (reason) => {
    console.error(reason);
    // translate any errant AuthError expired into the biscuits version
    if (reason instanceof AuthError) {
      if (reason.message === 'Session expired') {
        const biscuitsExpired = new BiscuitsError(
          BiscuitsError.Code.SessionExpired,
        );
        return error(biscuitsExpired.statusCode, biscuitsExpired.body);
      } else if (reason.statusCode === 409) {
        const biscuitsError = new BiscuitsError(
          BiscuitsError.Code.Conflict,
          'You have an account with a different login method. Try logging in with a different method.',
        );
        return error(biscuitsError.statusCode, biscuitsError.body);
      } else if (reason.statusCode === 401) {
        // TODO: redirect to login?
        const biscuitsError = new BiscuitsError(
          BiscuitsError.Code.Unauthorized,
          'Unauthorized',
        );
        return error(biscuitsError.statusCode, biscuitsError.body);
      }
    }
    if (reason instanceof BiscuitsError) {
      return error(reason.statusCode, reason.body);
    }
    return error(500, 'Internal Server Error');
  },
});

const logger = (req: IRequest) => {
  if (req.route === '/') return;
  console.log(`[${req.method}] ${req.url}`);
};

router
  .all('*', logger, preflight)
  .get('/', () => 'Success!')
  .all('/auth/*', authRouter.fetch)
  .all('/verdant/*', verdantRouter.fetch)
  .all('/stripe/*', stripeRouter.fetch)
  .all('/graphql/*', graphqlRouter.fetch)
  .all('/gnocchi/*', gnocchiRouter.fetch);

const ittyServer = createServerAdapter((request) => router.fetch(request));

console.log('Checking for database migrations...');
await migrateToLatest();

const httpServer = createServer(ittyServer);
verdantServer.attach(httpServer, { httpPath: false });

const port = PORT;
if (process.env.NODE_ENV === 'development') {
  await killPortProcess(PORT);
}
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

productAdminSetup();
writeSchema();
