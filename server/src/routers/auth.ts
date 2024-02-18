import { Router } from 'itty-router';
import { GoogleProvider, createHandlers } from '@a-type/auth';
import { db, hashPassword, id } from '@biscuits/db';
import { assert } from '@a-type/utils';
import { UI_ORIGIN, DEPLOYED_HOST } from '../config/deployedContext.js';

export const authRouter = Router({
  base: '/auth',
});

assert(!!process.env.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID must be set');
assert(!!process.env.GOOGLE_CLIENT_SECRET, 'GOOGLE_CLIENT_SECRET must be set');

const handlers = createHandlers({
  defaultReturnTo: `${UI_ORIGIN}/`,
  providers: {
    google: new GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: DEPLOYED_HOST + '/auth/provider/google/callback',
    }),
  },
  db: {
    getAccountByProviderAccountId: async (providerName, providerAccountId) => {
      return db
        .selectFrom('Account')
        .where('provider', '=', providerName)
        .where('providerAccountId', '=', providerAccountId)
        .selectAll()
        .executeTakeFirst();
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
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
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
  .post('/logout', handlers.handleLogoutRequest);
