import { Router } from 'itty-router';
import { authHandlers } from '../auth/handlers.js';

export const authRouter = Router({
  base: '/auth',
});

authRouter
  .post('/provider/:provider/login', (req) => {
    const provider = req.params.provider;
    return authHandlers.handleOAuthLoginRequest(req, { provider });
  })
  .get('/provider/:provider/callback', (req) => {
    const provider = req.params.provider;
    return authHandlers.handleOAuthCallbackRequest(req, { provider });
  })
  .post('/logout', authHandlers.handleLogoutRequest)
  .post('/begin-email-signup', authHandlers.handleSendEmailVerificationRequest)
  .post('/complete-email-signup', authHandlers.handleVerifyEmailRequest)
  .post('/email-login', authHandlers.handleEmailLoginRequest)
  .post('/begin-reset-password', authHandlers.handleResetPasswordRequest)
  .post(
    '/complete-reset-password',
    authHandlers.handleVerifyPasswordResetRequest,
  );
