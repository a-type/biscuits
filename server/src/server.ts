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
import { gnocchiRouter } from './routers/gnocchi.js';
import { rateLimit } from './rateLimiter.js';
import { wishWashRouter } from './routers/wishWash.js';
import { readFile } from 'fs/promises';
import { join } from 'path';

console.log('Starting server...', new Date().toISOString());

const { preflight, corsify } = cors({
	origin: ALLOWED_ORIGINS,
	credentials: true,
});

const router = AutoRouter({
	before: [preflight],
	finally: [corsify],
	catch: (reason) => {
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
			if (reason.code >= BiscuitsError.Code.Unexpected) {
				console.error(reason);
			}
			return error(reason.statusCode, reason.body);
		}
		console.error(reason);
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
	.all('/auth/*', rateLimit, authRouter.fetch)
	.all('/verdant/*', verdantRouter.fetch)
	.all('/stripe/*', rateLimit, stripeRouter.fetch)
	.all('/graphql/*', rateLimit, graphqlRouter.fetch)
	.all('/gnocchi/*', rateLimit, gnocchiRouter.fetch)
	.all('/wishWash/*', rateLimit, wishWashRouter.fetch);
// for local dev only, add endpoint to serve user files.
if (process.env.NODE_ENV !== 'production') {
	router.get('/userFiles/:dir/:id/:filename', async (req) => {
		try {
			const filePath = join(
				process.cwd(),
				`./userFiles/${req.params.dir}/${req.params.id}/${decodeURIComponent(req.params.filename)}`,
			);
			const file = await readFile(filePath);
			return new Response(file, {
				status: 200,
			});
		} catch (err) {
			console.error(err);
			return new Response('Not found', { status: 404 });
		}
	});
}

const ittyServer = createServerAdapter((request) => router.fetch(request));

await migrateToLatest();

const httpServer = createServer(ittyServer);
verdantServer.attach(httpServer, { httpPath: false });

const port = PORT;
if (process.env.NODE_ENV === 'development') {
	const { killPortProcess } = await import('kill-port-process');
	await killPortProcess(PORT);
}
httpServer.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

productAdminSetup();
if (process.env.NODE_ENV === 'development') {
	setTimeout(writeSchema);
}
