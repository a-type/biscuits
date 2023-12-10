import { parse, serialize } from 'cookie';
import { Request, Response } from 'express';
import { IncomingMessage, OutgoingMessage } from 'http';

const SESSION_COOKIE_NAME = 'biscuits-session';
const RETURN_TO_COOKIE_NAME = 'biscuits-return-to';
const INVITE_ID_COOKIE_NAME = 'biscuits-invite-id';

export const MAX_AGE = 60 * 60 * 24 * 14; // 2 weeks

export function setSessionCookie(res: OutgoingMessage, token: string) {
  const cookie = serialize(SESSION_COOKIE_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function removeSessionCookie(res: OutgoingMessage) {
  const cookie = serialize(SESSION_COOKIE_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function parseCookies(req: IncomingMessage) {
  if ((req as any).cookies) return (req as any).cookies;

  const cookie = req.headers?.cookie;
  return parse(cookie || '');
}

export function getSessionCookie(req: IncomingMessage) {
  return parseCookies(req)[SESSION_COOKIE_NAME];
}

export function setReturnToCookie(req: Request, res: Response) {
  let returnTo = req.query.returnTo as string | undefined;
  if (!returnTo) {
    returnTo = req.headers.referer as string | undefined;
  }
  if (!returnTo) {
    return;
  }

  const cookie = serialize(RETURN_TO_COOKIE_NAME, returnTo, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function getReturnToCookie(req: IncomingMessage) {
  return parseCookies(req)[RETURN_TO_COOKIE_NAME];
}

export function removeReturnToCookie(res: OutgoingMessage) {
  const cookie = serialize(RETURN_TO_COOKIE_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function setInviteIdCookie(req: Request, res: Response) {
  let inviteId = req.query.inviteId as string | undefined;
  if (!inviteId) {
    return;
  }

  const cookie = serialize(INVITE_ID_COOKIE_NAME, inviteId, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function getInviteIdCookie(req: IncomingMessage) {
  return parseCookies(req)[INVITE_ID_COOKIE_NAME];
}

export function removeInviteIdCookie(res: OutgoingMessage) {
  const cookie = serialize(INVITE_ID_COOKIE_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}
