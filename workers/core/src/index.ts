import { Hono } from 'hono';
import { logger } from 'hono/logger';

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
	.get('/health', (ctx) => ctx.json({ status: 'ok' }))
	.route('/auth', authRouter)
	.route('/verdant', verdantRouter)
	.route('/stripe', stripeRouter)
	.route('/graphql', graphqlRouter)
	.route('/gnocchi', gnocchiRouter)
	.route('/wish-wash', wishWashRouter)
	.route('/post', postRouter);

export default app;

export type AppType = typeof app;

// DOs
export { VerdantLibrary } from './verdant/VerdantLibrary.js';
