import { assert } from '@a-type/utils';
import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { MAX_AGE, setSessionCookie, getSessionCookie } from './cookies.js';
import { Response } from 'express';

type SessionJwt = jwt.JwtPayload & {
  pid: string;
  nam: string;
  role: 'admin' | 'user';
  pad: boolean;
};

export type Session = {
  name: string | null;
  planId: string | null;
  isProductAdmin: boolean;
  userId: string;
  role: 'admin' | 'user';
};

const SESSION_SECRET = process.env.SESSION_SECRET;
assert(SESSION_SECRET, 'SESSION_SECRET environment variable must be set');

export async function setLoginSession(res: Response, session: Session | null) {
  if (!session) {
    // if the session is null, remove the session cookie
    setSessionCookie(res, '');
    return;
  }

  // create a session object with a max age we can validate later
  const sessionObject = {
    sub: session.userId,
    iat: Date.now(),
    pid: session.planId,
    nam: session.name,
    role: session.role,
    pad: session.isProductAdmin,
  };
  const token = jwt.sign(sessionObject, SESSION_SECRET!, {
    expiresIn: MAX_AGE,
  });

  setSessionCookie(res, token);
}

export async function getLoginSession(req: IncomingMessage) {
  const token = getSessionCookie(req);
  if (!token) return null;

  const session = jwt.verify(token, SESSION_SECRET!) as SessionJwt;

  if (session && session.sub) {
    return {
      userId: session.sub,
      planId: session.pid,
      name: session.nam,
      role: session.role,
      isProductAdmin: session.pad,
    };
  } else {
    return null;
  }
}
