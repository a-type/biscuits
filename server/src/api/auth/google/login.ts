import { Request, Response } from 'express';
import { googleOauth } from '../../../auth/google.js';
import { setInviteIdCookie, setReturnToCookie } from '../../../auth/cookies.js';

export default async function googleLoginHandler(req: Request, res: Response) {
  setReturnToCookie(req, res);
  setInviteIdCookie(req, res);

  const authorizationUrl = googleOauth.generateAuthUrl({
    access_type: 'online',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    include_granted_scopes: true,
  });

  res.writeHead(302, { Location: authorizationUrl }).end();
}
