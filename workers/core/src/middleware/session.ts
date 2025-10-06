import { AuthError } from '@a-type/auth';
import { BiscuitsError } from '@biscuits/error';
import { createMiddleware } from 'hono/factory';
import { sessions } from '../auth/session.js';
import { HonoEnv } from '../config/hono.js';

export const sessionMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
	// skip on auth requests
	if (c.req.path.startsWith('/auth/')) {
		await next();
		return;
	}

	try {
		const session = await sessions.getSession(c as any);
		c.set('session', session);
		await next();
	} catch (e) {
		// if session expired, we need to tell the client to refresh it
		if (e instanceof AuthError) {
			if (e.message === AuthError.Messages.SessionExpired) {
				throw new BiscuitsError(
					BiscuitsError.Code.SessionExpired,
					'Session expired',
				);
			} else if (e.message === AuthError.Messages.InvalidSession) {
				throw new BiscuitsError(
					BiscuitsError.Code.SessionInvalid,
					'Session invalid',
				);
			}
		}
		throw e;
	}
});
