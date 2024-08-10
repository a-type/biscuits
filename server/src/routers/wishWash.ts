import { Router } from 'itty-router';
import * as path from 'path';
import * as fsSync from 'fs';
import { serverRender, type HubWishlistData } from '@wish-wash.biscuits/hub';
import { verdantServer } from '../verdant/verdant.js';
import { getLibraryName } from '@biscuits/libraries';
import { db } from '@biscuits/db';
import { renderTemplate, staticFile } from '../common/hubs.js';
import { ListSnapshot as WishlistSnapshot } from '@wish-wash.biscuits/verdant';
import { sessions } from '../auth/session.js';
import { Session } from '@a-type/auth';

export const wishWashRouter = Router({
  base: '/wishWash',
});

const hubPath = path.join(
  process.cwd(),
  '..',
  'apps',
  'wish-wash',
  'hub',
  'dist',
);
const hubClientPath = path.join(hubPath, 'client');

const indexTemplate = fsSync.readFileSync(
  path.join(hubClientPath, 'index.html'),
  'utf8',
);

wishWashRouter.get('/hubList/assets/*', (req) =>
  staticFile(hubClientPath, 'wishWash/hubList', req),
);

wishWashRouter.get('/hubList/favicon.ico', (req) =>
  staticFile(hubClientPath, 'wishWash/hubList', req),
);

wishWashRouter.get('/hubList/:listSlug', async (req) => {
  const { listSlug } = req.params;
  // parse slug out of fragment
  const slug = listSlug.split('-').slice(-1)[0];

  const wishList = await db
    .selectFrom('PublishedWishlist')
    .leftJoin('User', 'PublishedWishlist.publishedBy', 'User.id')
    .select([
      'PublishedWishlist.id',
      'User.fullName as publisherFullName',
      'PublishedWishlist.planId',
      'PublishedWishlist.publishedBy',
    ])
    .where('slug', '=', slug)
    .executeTakeFirst();

  if (!wishList) {
    return new Response('Wishlist not found', { status: 404 });
  }

  const snapshot = (await verdantServer.getDocumentSnapshot(
    getLibraryName({
      planId: wishList.planId,
      app: 'wish-wash',
      access: 'members',
      userId: wishList.publishedBy,
    }),
    'lists',
    wishList.id,
  )) as WishlistSnapshot;

  if (!snapshot) {
    return new Response('Wishlist not found', { status: 404 });
  }

  let session: Session | null = null;
  try {
    session = await sessions.getSession(req);
  } catch (err) {
    // that's fine
  }
  // is this the user's list?
  const isUsersList = session?.userId === wishList.publishedBy;

  const data: HubWishlistData = {
    id: wishList.id,
    title: snapshot.name,
    hidePurchases: isUsersList,
    // mapping manually here to avoid leaking unintended data.
    items: snapshot.items.map((item) => ({
      description: item.description,
      count: item.count,
      purchasedCount: item.purchasedCount,
      links: item.links,
      prioritized: item.prioritized,
      imageUrls: item.imageFiles
        .map((f) => f.url)
        .filter((url): url is string => !!url),
      createdAt: item.createdAt,
    })),
  };

  const appHtml = serverRender(data);
  return renderTemplate(indexTemplate, appHtml, data);
});

wishWashRouter.get('/hubList/*', (req) =>
  staticFile(hubClientPath, 'wishWash/hubList', req),
);
