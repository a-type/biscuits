import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { corsMiddleware } from './middleware/cors.js';
import { domainRoutesMiddleware } from './middleware/domainRoutes.js';
import { handleError } from './middleware/errors.js';
import { rateLimiterMiddleware } from './middleware/rateLimiter.js';
import {
	sessionMiddleware,
	sessionRefreshMiddleware,
} from './middleware/session.js';
import { authRouter } from './routers/auth.js';
import { gnocchiRouter } from './routers/gnocchi.js';
import { graphqlRouter } from './routers/graphql.js';
import { postRouter } from './routers/post.js';
import { stripeRouter } from './routers/stripe.js';
import { verdantRouter } from './routers/verdant.js';

export const app = new Hono()
	.onError(handleError)
	.use(logger())
	.use(corsMiddleware)
	.use(sessionMiddleware)
	.use(rateLimiterMiddleware)
	.use(domainRoutesMiddleware)
	.get('/health', (ctx) => ctx.json({ status: 'ok' }))
	.route('/auth', authRouter)
	// Verdant sync, auth, files
	.route('/verdant', verdantRouter.use(sessionRefreshMiddleware))
	// GraphQL API
	.route('/graphql', graphqlRouter.use(sessionRefreshMiddleware))
	// Stripe webhooks, also checkout session stuff
	.route('/stripe', stripeRouter)
	// Hub pages
	.route('/gnocchi', gnocchiRouter)
	.route('/post', postRouter);

export default app;

export type AppType = typeof app;

// DOs
export { VerdantLibrary } from './verdant/VerdantLibrary.js';
