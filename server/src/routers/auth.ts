import { Router } from 'itty-router';
import { authHandlers } from '../auth/handlers.js';
import { AuthError } from '@a-type/auth';
import { UI_ORIGIN } from '../config/deployedContext.js';

export const authRouter = Router({
  base: '/auth',
});

authRouter
  .post('/provider/:provider/login', (req) => {
    const provider = req.params.provider;
    try {
      return authHandlers.handleOAuthLoginRequest(req, { provider });
    } catch (err) {
      return routeAuthErrorsToUi('/login')(err as Error);
    }
  })
  .get('/provider/:provider/callback', (req) => {
    const provider = req.params.provider;
    return authHandlers
      .handleOAuthCallbackRequest(req, { provider })
      .catch(routeAuthErrorsToUi('/login'));
  })
  .all('/logout', (req) =>
    authHandlers.handleLogoutRequest(req).catch(routeAuthErrorsToUi('/')),
  )
  .post('/begin-email-signup', (req) =>
    authHandlers
      .handleSendEmailVerificationRequest(req)
      .catch(routeAuthErrorsToUi('/login')),
  )
  .post('/complete-email-signup', (req) =>
    authHandlers
      .handleVerifyEmailRequest(req)
      .catch(routeAuthErrorsToUi('/login')),
  )
  .post('/email-login', (req) =>
    authHandlers
      .handleEmailLoginRequest(req)
      .catch(routeAuthErrorsToUi('/login')),
  )
  .post('/begin-reset-password', (req) =>
    authHandlers
      .handleResetPasswordRequest(req)
      .catch(routeAuthErrorsToUi('/login')),
  )
  .post('/complete-reset-password', (req) =>
    authHandlers
      .handleVerifyPasswordResetRequest(req)
      .catch(routeAuthErrorsToUi('/login')),
  )
  .post('/refresh', authHandlers.handleRefreshSessionRequest);

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
