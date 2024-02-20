import { GoogleProvider, createHandlers } from '@a-type/auth';
import { assert } from '@a-type/utils';
import { db, hashPassword, id } from '@biscuits/db';
import { Router } from 'itty-router';
import { sessions } from '../auth/session.js';
import { DEPLOYED_HOST, UI_ORIGIN } from '../config/deployedContext.js';
import { email } from '../services/email.js';

export const authRouter = Router({
  base: '/auth',
});

assert(!!process.env.GOOGLE_AUTH_CLIENT_ID, 'GOOGLE_CLIENT_ID must be set');
assert(
  !!process.env.GOOGLE_AUTH_CLIENT_SECRET,
  'GOOGLE_CLIENT_SECRET must be set',
);

const handlers = createHandlers({
  sessions,
  defaultReturnTo: `${UI_ORIGIN}/`,
  providers: {
    google: new GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
      redirectUri: DEPLOYED_HOST + '/auth/provider/google/callback',
    }),
  },
  email: email,
  db: {
    getAccountByProviderAccountId: async (providerName, providerAccountId) => {
      const dbAccount = await db
        .selectFrom('Account')
        .where('provider', '=', providerName)
        .where('providerAccountId', '=', providerAccountId)
        .selectAll()
        .executeTakeFirst();

      if (!dbAccount) {
        return undefined;
      }

      return {
        ...dbAccount,
        expiresAt: dbAccount.accessTokenExpiresAt?.getTime() ?? null,
      };
    },
    getUserByEmail: async (email) => {
      return db
        .selectFrom('User')
        .where('email', '=', email)
        .selectAll()
        .executeTakeFirst();
    },
    insertAccount: async ({ expiresAt, ...account }) => {
      return db
        .insertInto('Account')
        .values({
          id: id(),
          accessTokenExpiresAt: expiresAt ? new Date(expiresAt) : undefined,
          ...account,
        })
        .returning('id')
        .executeTakeFirstOrThrow();
    },
    insertUser: async ({
      plaintextPassword,
      fullName,
      friendlyName,
      ...user
    }) => {
      const password = plaintextPassword
        ? await hashPassword(plaintextPassword)
        : undefined;
      return db
        .insertInto('User')
        .values({
          id: id(),
          password,
          fullName: fullName || 'Anonymous',
          friendlyName: friendlyName || 'Anonymous',
          isProductAdmin: false,
          ...user,
        })
        .returning('id')
        .executeTakeFirstOrThrow();
    },
    insertVerificationCode: async ({ expiresAt, ...verificationCode }) => {
      await db
        .insertInto('VerificationCode')
        .values({
          id: id(),
          expiresAt: new Date(expiresAt),
          ...verificationCode,
        })
        .returning('id')
        .executeTakeFirstOrThrow();
    },
    getVerificationCode: async (id) => {
      const value = await db
        .selectFrom('VerificationCode')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();

      if (!value) {
        return undefined;
      }

      return {
        ...value,
        expiresAt: value.expiresAt.getTime(),
      };
    },
    consumeVerificationCode: async (id) => {
      await db.deleteFrom('VerificationCode').where('id', '=', id).execute();
    },
    getUserByEmailAndPassword: async (email, password) => {
      return db
        .selectFrom('User')
        .where('email', '=', email)
        .where('password', '=', password)
        .selectAll()
        .executeTakeFirst();
    },
  },
});

authRouter
  .post('/provider/:provider/login', (req) => {
    const provider = req.params.provider;
    return handlers.handleOAuthLoginRequest(req, { provider });
  })
  .get('/provider/:provider/callback', (req) => {
    const provider = req.params.provider;
    return handlers.handleOAuthCallbackRequest(req, { provider });
  })
  .post('/logout', handlers.handleLogoutRequest)
  .post('/begin-email-signup', handlers.handleSendEmailVerificationRequest)
  .post('/complete-email-signup', handlers.handleVerifyEmailRequest)
  .post('/email-login', handlers.handleEmailLoginRequest)
  .post('/begin-reset-password', handlers.handleResetPasswordRequest)
  .post('/complete-reset-password', handlers.handleVerifyPasswordResetRequest);
