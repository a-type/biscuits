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
	} catch (e) {
		// if session expired, we need to tell the client to refresh it.
		// we don't throw immediately as the actual route may not care.
		if (e instanceof AuthError) {
			if (e.message === AuthError.Messages.SessionExpired) {
				c.set(
					'sessionError',
					new BiscuitsError(
						BiscuitsError.Code.SessionExpired,
						'Session expired',
						e,
					),
				);
			} else if (e.message === AuthError.Messages.InvalidSession) {
				c.set(
					'sessionError',
					new BiscuitsError(
						BiscuitsError.Code.SessionInvalid,
						'Session invalid',
						e,
					),
				);
			} else {
				c.set(
					'sessionError',
					new BiscuitsError(
						BiscuitsError.Code.SessionError,
						'Session error',
						e,
					),
				);
			}
		} else {
			c.set(
				'sessionError',
				new BiscuitsError(BiscuitsError.Code.SessionError, 'Session error', e),
			);
		}
	}
	await next();
});

/**
 * Actually throws if there was a session error.
 * This is separate from the main session middleware so that
 * routes that don't care about auth can skip it.
 */
export const sessionRefreshMiddleware = createMiddleware<HonoEnv>(
	async (c, next) => {
		const sessionError = c.get('sessionError');
		if (sessionError) {
			throw sessionError;
		}
		await next();
	},
);
