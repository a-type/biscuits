import { SessionManager } from '@a-type/auth';
import { db, userNameSelector } from '@biscuits/db';
import { BiscuitsError } from '../error.js';
import { SESSION_SECRET } from '../config/secrets.js';
import {
  DEPLOYED_ORIGIN,
  UI_ORIGIN,
  ENVIRONMENT,
} from '../config/deployedContext.js';

declare module '@a-type/auth' {
  interface Session {
    userId: string;
    name: string | null;
    isProductAdmin: boolean;
    role: 'admin' | 'user' | null;
    planId: string | null;
  }
}

export const sessions = new SessionManager({
  cookieName: 'bsc-session',
  cookieOptions: {
    sameSite: 'none',
    // this is not sustainable, but hopefully by the time
    // cross-site cookies are fully blocked everyone will be
    // on gnocchi.biscuits.club
    partitioned: false,
  },
  expiration: process.env.NODE_ENV === 'production' ? '24h' : '1m',
  async createSession(userId) {
    const user = await db
      .selectFrom('User')
      .where('id', '=', userId)
      .select(['id', 'isProductAdmin', 'planId', 'planRole'])
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
    };
  },
  secret: SESSION_SECRET,
  shortNames: {
    userId: 'sub',
    isProductAdmin: 'pad',
    name: 'name',
    planId: 'pid',
    role: 'role',
  },
  audience: UI_ORIGIN,
  issuer: DEPLOYED_ORIGIN,
  // mode: ENVIRONMENT === 'production' ? 'production' : 'development',
  mode: 'production',
  refreshPath: '/auth/refresh',
  refreshTokenCookieName: 'bsc-refresh',
});
