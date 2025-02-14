import { AuthError } from '@a-type/auth';
import { Hono } from 'hono';
import { authHandlers } from '../auth/handlers.js';
import { DEPLOYED_ORIGIN, UI_ORIGIN } from '../config/deployedContext.js';
import { Env } from '../config/hono.js';

export const authRouter = new Hono<Env>();

authRouter
	.post('/provider/:provider/login', (ctx) => {
		const provider = ctx.req.param('provider');
		try {
			return authHandlers.handleOAuthLoginRequest(ctx, { provider });
		} catch (err) {
			return routeAuthErrorsToUi('/login')(err as Error);
		}
	})
	.get('/provider/:provider/callback', (ctx) => {
		const provider = ctx.req.param('provider');
		return authHandlers
			.handleOAuthCallbackRequest(ctx, { provider })
			.catch(routeAuthErrorsToUi('/login'));
	})
	.all('/logout', async (ctx) => {
		const res = await authHandlers
			.handleLogoutRequest(ctx)
			.catch(routeAuthErrorsToUi('/'));
		// also clear old cookies
		res.headers.append(
			'Set-Cookie',
			`bsc-session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Domain=${DEPLOYED_ORIGIN}`,
		);
		res.headers.append(
			'Set-Cookie',
			`bsc-refresh=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Domain=${DEPLOYED_ORIGIN}`,
		);
		return res;
	})
	.post('/begin-email-signup', (ctx) =>
		authHandlers
			.handleSendEmailVerificationRequest(ctx)
			.catch(routeAuthErrorsToUi('/login')),
	)
	.post('/complete-email-signup', (ctx) =>
		authHandlers
			.handleVerifyEmailRequest(ctx)
			.catch(routeAuthErrorsToUi('/login')),
	)
	.post('/email-login', (ctx) =>
		authHandlers
			.handleEmailLoginRequest(ctx)
			.catch(routeAuthErrorsToUi('/login')),
	)
	.post('/begin-reset-password', (ctx) =>
		authHandlers
			.handleResetPasswordRequest(ctx)
			.catch(routeAuthErrorsToUi('/login')),
	)
	.post('/complete-reset-password', (ctx) =>
		authHandlers
			.handleVerifyPasswordResetRequest(ctx)
			.catch(routeAuthErrorsToUi('/login')),
	)
	.post('/refresh', (ctx) => authHandlers.handleRefreshSessionRequest(ctx))
	.get('/session', (ctx) => authHandlers.handleSessionRequest(ctx));

function routeAuthErrorsToUi(path: string) {
	return function (err: Error) {
		console.error(err);
		if (err instanceof AuthError) {
			return new Response(null, {
				status: 302,
				headers: {
					Location: `${UI_ORIGIN}${path}?error=${encodeURIComponent(err.message)}`,
				},
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: `${UI_ORIGIN}${path}?error=${encodeURIComponent('Something went wrong. Try again?')}`,
			},
		});
	};
}
