import { assert } from '@a-type/utils';
import { Request, Response } from 'express';
import { googleOauth } from '../../../auth/google.js';
import { getInviteIdCookie } from '../../../auth/cookies.js';
import { db, id } from '@biscuits/db';
import { User } from '@biscuits/db/src/tables.js';
import { setLoginSession } from '../../../auth/session.js';

export default async function googleCallbackHandler(
  req: Request,
  res: Response,
) {
  const { code } = req.query;
  assert(typeof code === 'string', 'code is required');
  const { tokens } = await googleOauth.getToken(code);
  googleOauth.setCredentials(tokens);
  const profileResponse = await googleOauth.request({
    url: 'https://www.googleapis.com/oauth2/v3/userinfo',
  });
  if (profileResponse.status !== 200) {
    throw new Error(
      `Failed to fetch profile: ${profileResponse.status} ${profileResponse.data}`,
    );
  }
  const googleProfile = profileResponse.data as GoogleOAuthProfile;

  const inviteId = getInviteIdCookie(req);

  // find an existing Google account association and user
  const accountAndProfile = await db
    .selectFrom('Account')
    .where('provider', '=', 'google')
    .where('providerAccountId', '=', googleProfile.sub)
    .innerJoin('Profile', 'Profile.id', 'Account.profileId')
    .selectAll()
    .executeTakeFirst();

  let profile: User;

  if (!accountAndProfile) {
    profile = await db.transaction().execute(async (trx) => {
      let planId: string | undefined;
      if (inviteId) {
        const invite = await trx
          .selectFrom('PlanInvitation')
          .selectAll()
          .where('id', '=', inviteId)
          .executeTakeFirst();
        if (invite) {
          planId = invite.planId;
        }
      }

      const profile = await trx
        .insertInto('Profile')
        .values({
          id: id(),
          email: googleProfile.email,
          fullName: googleProfile.name,
          friendlyName: googleProfile.given_name || googleProfile.name,
          imageUrl: googleProfile.picture || null,
          isProductAdmin: false,
          planRole: 'user',
          planId,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('Account')
        .values({
          id: id(),
          profileId: profile.id,
          provider: 'google',
          providerAccountId: googleProfile.sub,
          type: 'oauth2',
          accessToken: tokens.access_token!,
          tokenType: 'Bearer',
        })
        .execute();

      if (inviteId) {
        await trx
          .updateTable('PlanInvitation')
          .where('id', '=', inviteId)
          .set({
            claimedAt: new Date().toISOString(),
          })
          .execute();
      }

      return profile;
    });
  } else {
    profile = accountAndProfile;
  }

  await setLoginSession(res, {
    userId: profile.id,
    name: profile.friendlyName,
    planId: profile.planId,
    role: profile.planRole as 'admin' | 'user',
    isProductAdmin: profile.isProductAdmin,
  });

  // TODO: safari hack compat
  res.writeHead(302, { Location: '/api/auth/loginSuccess' });
  res.end();
}

type GoogleOAuthProfile = {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified: boolean;
  locale: string;
};
