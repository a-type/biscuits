import { AuthError } from '@a-type/auth';
import { Hono } from 'hono';
import { authHandlers } from '../auth/handlers.js';
import { UI_ORIGIN } from '../config/deployedContext.js';
import { Env } from '../config/hono.js';

export const authRouter = new Hono<Env>();

authRouter
	.post('/provider/:provider/login', (ctx) => {
		const provider = ctx.req.param('provider');
		try {
			return authHandlers.handleOAuthLoginRequest(ctx.req.raw, { provider });
		} catch (err) {
			return routeAuthErrorsToUi('/login')(err as Error);
		}
	})
	.get('/provider/:provider/callback', (ctx) => {
		const provider = ctx.req.param('provider');
		return authHandlers
			.handleOAuthCallbackRequest(ctx.req.raw, { provider })
			.catch(routeAuthErrorsToUi('/login'));
	})
	.all('/logout', (ctx) =>
		authHandlers
			.handleLogoutRequest(ctx.req.raw)
			.catch(routeAuthErrorsToUi('/')),
	)
	.post('/begin-email-signup', (ctx) =>
		authHandlers
			.handleSendEmailVerificationRequest(ctx.req.raw)
			.catch(routeAuthErrorsToUi('/login')),
	)
	.post('/complete-email-signup', (ctx) =>
		authHandlers
			.handleVerifyEmailRequest(ctx.req.raw)
			.catch(routeAuthErrorsToUi('/login')),
	)
	.post('/email-login', (ctx) =>
		authHandlers
			.handleEmailLoginRequest(ctx.req.raw)
			.catch(routeAuthErrorsToUi('/login')),
	)
	.post('/begin-reset-password', (ctx) =>
		authHandlers
			.handleResetPasswordRequest(ctx.req.raw)
			.catch(routeAuthErrorsToUi('/login')),
	)
	.post('/complete-reset-password', (ctx) =>
		authHandlers
			.handleVerifyPasswordResetRequest(ctx.req.raw)
			.catch(routeAuthErrorsToUi('/login')),
	)
	.post('/refresh', (ctx) =>
		authHandlers.handleRefreshSessionRequest(ctx.req.raw),
	)
	.get('/session', (ctx) => authHandlers.handleSessionRequest(ctx.req.raw));

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
