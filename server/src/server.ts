import { verdantServer } from './verdant/verdant.js';
import { createServer } from 'http';
import { productAdminSetup } from './tasks/productAdminSetup.js';
import { ALLOWED_ORIGINS } from './config/cors.js';
import { PORT } from './config/deployedContext.js';
import { createServerAdapter } from '@whatwg-node/server';
import { error, json, Router, createCors, IRequest } from 'itty-router';
import { authRouter } from './routers/auth.js';
import { trpcRouter } from './routers/trpc.js';
import { migrateToLatest } from '@biscuits/db';
import { verdantRouter } from './routers/verdant.js';
import { BiscuitsError } from './error.js';
import { stripeRouter } from './routers/stripe.js';

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
  .get('/', () => 'Success!')
  .all('/auth/*', authRouter.handle)
  .all('/trpc/*', trpcRouter.handle)
  .all('/verdant/*', verdantRouter.handle)
  .all('/stripe/*', stripeRouter.handle)
  .all('*', () => error(404));

const ittyServer = createServerAdapter((request) =>
  router
    .handle(request)
    .catch((reason) => {
      console.error(reason);
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

await migrateToLatest();

const httpServer = createServer(ittyServer);
verdantServer.attach(httpServer, { httpPath: false });

const port = PORT;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

productAdminSetup();
