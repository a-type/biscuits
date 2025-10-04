import { AuthError } from '@a-type/auth';
import { Context, Hono } from 'hono';
import { authHandlers } from '../auth/handlers.js';
import { sessions } from '../auth/session.js';
import { HonoEnv } from '../config/hono.js';

export const authRouter = new Hono<HonoEnv>();

authRouter
	.post('/provider/:provider/login', (ctx) => {
		const provider = ctx.req.param('provider');
		try {
			return authHandlers.handleOAuthLoginRequest(ctx, { provider });
		} catch (err) {
			return routeAuthErrorsToUi('/login', ctx)(err as Error);
		}
	})
	.get('/provider/:provider/callback', (ctx) => {
		const provider = ctx.req.param('provider');
		return authHandlers
			.handleOAuthCallbackRequest(ctx, { provider })
			.catch(routeAuthErrorsToUi('/login', ctx));
	})
	.all('/logout', async (ctx) => {
		const res = await authHandlers
			.handleLogoutRequest(ctx)
			.catch(routeAuthErrorsToUi('/', ctx));
		// also clear old cookies
		const host = new URL(ctx.env.DEPLOYED_ORIGIN).host;
		res.headers.append(
			'Set-Cookie',
			`bsc-session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Domain=${host}`,
		);
		res.headers.append(
			'Set-Cookie',
			`bsc-refresh=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Domain=${host}`,
		);
		res.headers.append(
			'Set-Cookie',
			`bsc-session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax;`,
		);
		res.headers.append(
			'Set-Cookie',
			`bsc-refresh=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax;`,
		);
		return res;
	})
	.post('/begin-email-signup', (ctx) =>
		authHandlers
			.handleSendEmailVerificationRequest(ctx)
			.catch(routeAuthErrorsToUi('/login', ctx)),
	)
	.post('/complete-email-signup', (ctx) =>
		authHandlers
			.handleVerifyEmailRequest(ctx)
			.catch(routeAuthErrorsToUi('/login', ctx)),
	)
	.post('/email-login', (ctx) =>
		authHandlers
			.handleEmailLoginRequest(ctx)
			.catch(routeAuthErrorsToUi('/login', ctx)),
	)
	.post('/begin-reset-password', (ctx) =>
		authHandlers
			.handleResetPasswordRequest(ctx)
			.catch(routeAuthErrorsToUi('/login', ctx)),
	)
	.post('/complete-reset-password', (ctx) =>
		authHandlers
			.handleVerifyPasswordResetRequest(ctx)
			.catch(routeAuthErrorsToUi('/login', ctx)),
	)
	.post('/refresh', async (ctx) => {
		try {
			return await authHandlers.handleRefreshSessionRequest(ctx);
		} catch (err) {
			const { headers: clearHeaders } = await sessions.clearSession(ctx);
			return new Response(
				JSON.stringify({
					error: String(err),
				}),
				{
					status: 400,
					headers: {
						...clearHeaders,
					},
				},
			);
		}
	})
	.get('/session', (ctx) => authHandlers.handleSessionRequest(ctx));

function routeAuthErrorsToUi(path: string, ctx: Context<HonoEnv>) {
	return function (err: Error) {
		console.error(err);
		if (err instanceof AuthError) {
			return new Response(null, {
				status: 302,
				headers: {
					Location: `${ctx.env.UI_ORIGIN}${path}?error=${encodeURIComponent(err.message)}`,
				},
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: `${ctx.env.UI_ORIGIN}${path}?error=${encodeURIComponent('Something went wrong. Try again?')}`,
			},
		});
	};
}
