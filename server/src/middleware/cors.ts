import { cors } from 'hono/cors';
import {
	ALLOWED_HEADERS,
	ALLOWED_ORIGINS,
	EXPOSED_HEADERS,
} from '../config/cors.js';
import { domainRoutes } from '../services/domainRouteCache.js';

export const corsMiddleware = cors({
	origin: (origin) => {
		if (ALLOWED_ORIGINS.includes(origin)) {
			return origin;
		}
		if (!URL.canParse(origin)) {
			return;
		}
		const host = new URL(origin).host;
		if (domainRoutes.has(host)) {
			return origin;
		}
	},
	credentials: true,
	allowHeaders: ALLOWED_HEADERS,
	exposeHeaders: EXPOSED_HEADERS,
});
