import { GoogleProvider, createHandlers } from '@a-type/auth';
import { assert } from '@a-type/utils';
import { db, hashPassword, id } from '@biscuits/db';
import { sessions } from '../auth/session.js';
import { DEPLOYED_HOST, UI_ORIGIN } from '../config/deployedContext.js';
import { email } from '../services/email.js';

assert(!!process.env.GOOGLE_AUTH_CLIENT_ID, 'GOOGLE_CLIENT_ID must be set');
assert(
  !!process.env.GOOGLE_AUTH_CLIENT_SECRET,
  'GOOGLE_CLIENT_SECRET must be set',
);

export const authHandlers = createHandlers({
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
      return db.transaction().execute(async (tx) => {
        const plan = await tx
          .insertInto('Plan')
          .values({
            id: id(),
            name: `${friendlyName ?? fullName ?? 'Anonymous'}'s Plan`,
          })
          .returning('id')
          .executeTakeFirstOrThrow();

        const userResult = await tx
          .insertInto('User')
          .values({
            id: id(),
            password,
            fullName: fullName || 'Anonymous',
            friendlyName: friendlyName || 'Anonymous',
            isProductAdmin: false,
            planId: plan.id,
            planRole: 'admin',
            ...user,
          })
          .returning('id')
          .executeTakeFirstOrThrow();

        return userResult;
      });
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
