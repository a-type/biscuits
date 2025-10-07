import { honoAdapter, SessionManager } from '@a-type/auth';
import { createDb, userNameSelector } from '@biscuits/db';
import { Context } from 'hono';
import { getRootDomain } from '../common/domains.js';
import { HonoEnv } from '../config/hono.js';
import { BiscuitsError } from '../error.js';

declare module '@a-type/auth' {
	interface Session {
		userId: string;
		name: string | null;
		isProductAdmin: boolean;
		role: 'admin' | 'user' | null;
		planId: string | null;
		planHasSubscription: boolean;
		/** If not present, all apps are accessible. */
		allowedApp?: string;
	}
}

export const sessions = new SessionManager<Context<HonoEnv>>({
	getSessionConfig(ctx) {
		const db = createDb(ctx.env.CORE_DB);
		return {
			cookieName: 'bsc-session',
			cookieOptions: {
				sameSite: 'lax',
				domain: getRootDomain(ctx.env.DEPLOYED_ORIGIN),
			},
			expiration: ctx.env.ENVIRONMENT === 'production' ? '24h' : '1m',
			async createSession(userId) {
				const user = await db
					.selectFrom('User')
					.leftJoin('Plan', 'User.planId', 'Plan.id')
					.where('User.id', '=', userId)
					.select([
						'User.id',
						'User.isProductAdmin',
						'User.planId',
						'User.planRole',
						'Plan.allowedApp',
						'Plan.subscriptionStatus',
					])
					.select(userNameSelector)
					.executeTakeFirst();

				if (!user) {
					throw new BiscuitsError(
						BiscuitsError.Code.NotFound,
						`Invalid session. User with ID ${userId} not found`,
					);
				}

				return {
					userId,
					name: user.name,
					isProductAdmin: user.isProductAdmin,
					planId: user.planId,
					role: user.planRole,
					allowedApp: user.allowedApp ?? undefined,
					planHasSubscription: user.subscriptionStatus === 'active',
				};
			},
			secret: ctx.env.SESSION_SECRET,

			audience: ctx.env.UI_ORIGIN,
			issuer: ctx.env.DEPLOYED_ORIGIN,
			// mode: ENVIRONMENT === 'production' ? 'production' : 'development',
			mode: 'production',
			refreshPath: '/auth/refresh',
			refreshTokenCookieName: 'bsc-refresh',
			refreshTokenDurationMinutes: 60 * 24 * 90,
		};
	},
	shortNames: {
		userId: 'sub',
		isProductAdmin: 'pad',
		name: 'name',
		planId: 'pid',
		role: 'role',
		allowedApp: 'app',
		planHasSubscription: 'phs',
	},
	adapter: honoAdapter,
});
