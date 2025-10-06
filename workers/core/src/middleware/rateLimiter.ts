import { cloudflareRateLimiter } from '@hono-rate-limiter/cloudflare';
import { HonoEnv } from '../config/hono.js';

export const rateLimiterMiddleware = cloudflareRateLimiter<HonoEnv>({
	rateLimitBinding: (c) => {
		// use different limiters for public and authenticated users
		if (c.get('session')) {
			return c.env.AUTHENTICATED_RATE_LIMITER;
		} else {
			return c.env.PUBLIC_RATE_LIMITER;
		}
	},
	keyGenerator: (c) => {
		// use user ID as key for authenticated users
		const session = c.get('session');
		if (session) {
			return `user:${session.userId}`;
		}
		// use IP address for public users
		return c.req.header('CF-Connecting-IP') || 'unknown';
	},
});
