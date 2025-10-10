import { cors } from 'hono/cors';
import {
	ALLOWED_HEADERS,
	ALLOWED_ORIGINS,
	EXPOSED_HEADERS,
} from '../config/cors.js';
import { domainRoutes } from '../services/domainRoutes.js';

export const corsMiddleware = cors({
	origin: (origin, ctx) => {
		if (!origin) {
			console.log('No origin', ctx.req.url);
			return;
		}

		if (ALLOWED_ORIGINS(ctx.env).includes(origin)) {
			return origin;
		}
		if (!URL.canParse(origin)) {
			console.log('Invalid origin', origin);
			return;
		}
		const host = new URL(origin).host;
		if (domainRoutes.has(host)) {
			return origin;
		} else {
			console.log('Origin not allowed', origin);
		}
	},
	credentials: true,
	allowHeaders: ALLOWED_HEADERS,
	exposeHeaders: EXPOSED_HEADERS,
});
