import { Request, Response } from 'express';
import { UI_ORIGIN } from '../../config/deployedContext.js';
import { removeSessionCookie } from '../../auth/cookies.js';

export default async function logoutHandler(req: Request, res: Response) {
  removeSessionCookie(res);
  res.writeHead(302, { Location: UI_ORIGIN });
  res.end();
}
