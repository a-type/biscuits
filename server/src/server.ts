import { verdantServer } from './verdant/verdant.js';
import { createServer } from 'http';
import { productAdminSetup } from './tasks/productAdminSetup.js';
import { ALLOWED_ORIGINS } from './config/cors.js';
import { PORT } from './config/deployedContext.js';
import { createServerAdapter } from '@whatwg-node/server';
import { error, json, Router, createCors, IRequest } from 'itty-router';
import { authRouter } from './routers/auth.js';
import { migrateToLatest } from '@biscuits/db';
import { verdantRouter } from './routers/verdant.js';
import { BiscuitsError } from '@biscuits/error';
import { stripeRouter } from './routers/stripe.js';
import { graphqlRouter } from './routers/graphql.js';
import { writeSchema } from './tasks/writeSchema.js';
import { AuthError } from '@a-type/auth';
import { appsRouter } from './routers/apps.js';
import { transferRouter } from './routers/transfer.js';
import { killPortProcess } from 'kill-port-process';

console.log('Starting server...');

const router = Router();

const { preflight, corsify } = createCors({
  origins: ALLOWED_ORIGINS,
  headers: { 'Access-Control-Allow-Credentials': true },
});

const logger = (req: IRequest) => {
  console.log(`[${req.method}] ${req.url}`);
};

router
  .all('*', logger, preflight)
  .all('*', appsRouter.handle)
  .get('/', () => 'Success!')
  .all('/auth/*', authRouter.handle)
  .all('/verdant/*', verdantRouter.handle)
  .all('/stripe/*', stripeRouter.handle)
  .all('/graphql/*', graphqlRouter.handle)
  .all('/transfer/*', transferRouter.handle)
  .all('*', () => error(404));

const ittyServer = createServerAdapter((request) =>
  router
    .handle(request)
    .catch((reason) => {
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
    })
    .then((res) => {
      if (res instanceof Response) return res;
      return json(res);
    })
    .then((res) => {
      return corsify(res);
    }),
);

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
