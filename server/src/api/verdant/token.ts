import { Request, Response } from 'express';
import { ReplicaType, TokenProvider } from '@verdant-web/server';
import { DEPLOYED_HOST } from '../../config/deployedContext.js';
import { assert } from '@a-type/utils';
import { verifySubscription } from '../../auth/subscription.js';
import { getLoginSession } from '../../auth/session.js';

assert(!!process.env.VERDANT_SECRET, 'VERDANT_SECRET must be set');
const tokenProvider = new TokenProvider({
  secret: process.env.VERDANT_SECRET,
});

export default async function tokenHandler(req: Request, res: Response) {
  let token;

  const app = req.query.app;

  const session = await getLoginSession(req);
  if (!session) {
    // if temporary access becomes a feature again, it will be checked
    // here...
    return res.status(401).send('Please log in');
  } else {
    // ensure plan is still in good standing
    await verifySubscription(session);
    // issue a token for <planId>-<app> library access
    token = tokenProvider.getToken({
      userId: session.userId,
      libraryId: `${session.planId}-${app}`,
      // clients will sync to this server endpoint
      syncEndpoint: `${DEPLOYED_HOST}/verdant`,
      type: ReplicaType.Realtime,
    });
  }

  res.status(200).json({
    accessToken: token,
  });
}
