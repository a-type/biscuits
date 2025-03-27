import { readFile } from 'fs/promises';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { join } from 'path';

import { corsMiddleware } from './middleware/cors.js';
import { domainRoutesMiddleware } from './middleware/domainRoutes.js';
import { handleError } from './middleware/errors.js';
import { authRouter } from './routers/auth.js';
import { gnocchiRouter } from './routers/gnocchi.js';
import { graphqlRouter } from './routers/graphql.js';
import { postRouter } from './routers/post.js';
import { stripeRouter } from './routers/stripe.js';
import { verdantRouter } from './routers/verdant.js';
import { wishWashRouter } from './routers/wishWash.js';

export const app = new Hono()
	.onError(handleError)
	.use(logger())
	.use(corsMiddleware)
	.use(domainRoutesMiddleware)
	.get('/', (ctx) => ctx.text('Hello, world!'))
	.route('/auth', authRouter)
	.route('/verdant', verdantRouter)
	.route('/stripe', stripeRouter)
	.route('/graphql', graphqlRouter)
	.route('/gnocchi', gnocchiRouter)
	.route('/wish-wash', wishWashRouter)
	.route('/post', postRouter);

// for local dev, add endpoint to serve user files
if (process.env.NODE_ENV !== 'production') {
	app.get('/userFiles/:dir/:id/:filename', async (ctx) => {
		try {
			const filePath = join(
				process.cwd(),
				`./userFiles/${ctx.req.param('dir')}/${ctx.req.param('id')}/${decodeURIComponent(ctx.req.param('filename'))}`,
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

export type AppType = typeof app;
