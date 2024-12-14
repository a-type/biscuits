import { readFile } from 'fs/promises';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { join } from 'path';
import { ALLOWED_ORIGINS } from './config/cors.js';
import { handleError } from './middleware/errors.js';
import { authRouter } from './routers/auth.js';
import { gnocchiRouter } from './routers/gnocchi.js';
import { graphqlRouter } from './routers/graphql.js';
import { stripeRouter } from './routers/stripe.js';
import { verdantRouter } from './routers/verdant.js';
import { wishWashRouter } from './routers/wishWash.js';

export const app = new Hono()
	.onError(handleError)
	.use(
		cors({
			origin: ALLOWED_ORIGINS,
			credentials: true,
			allowHeaders: [
				'Authorization',
				'Content-Type',
				'X-Request-Id',
				'X-Csrf-Token',
			],
			exposeHeaders: [
				'Content-Type',
				'Content-Length',
				'X-Request-Id',
				'Set-Cookie',
				'X-Biscuits-Error',
				'X-Biscuits-Message',
				'X-Csrf-Token',
			],
		}),
	)
	.use(logger())
	.get('/', (ctx) => ctx.text('Hello, world!'))
	.route('/auth', authRouter)
	.route('/verdant', verdantRouter)
	.route('/stripe', stripeRouter)
	.route('/graphql', graphqlRouter)
	.route('/gnocchi', gnocchiRouter)
	.route('/wishWash', wishWashRouter);

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
