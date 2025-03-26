import { cors } from 'hono/cors';
import {
	ALLOWED_HEADERS,
	ALLOWED_ORIGINS,
	EXPOSED_HEADERS,
} from '../config/cors.js';
import { logger } from '../logger.js';
import { domainRoutes } from '../services/domainRouteCache.js';

export const corsMiddleware = cors({
	origin: (origin) => {
		if (ALLOWED_ORIGINS.includes(origin)) {
			return origin;
		}
		try {
			const host = new URL(origin).host;
			if (domainRoutes.has(host)) {
				return origin;
			}
		} catch (err) {
			logger.fatal('Error parsing origin', origin, err);
		}
	},
	credentials: true,
	allowHeaders: ALLOWED_HEADERS,
	exposeHeaders: EXPOSED_HEADERS,
});
