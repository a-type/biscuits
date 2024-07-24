import { Router } from 'itty-router';
import * as path from 'path';
import * as fsSync from 'fs';
import { serverRender, type HubWishlistData } from '@wish-wash.biscuits/hub';
import { verdantServer } from '../verdant/verdant.js';
import { getLibraryName } from '@biscuits/libraries';
import { db } from '@biscuits/db';
import { renderTemplate, staticFile } from '../common/hubs.js';

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
  staticFile(hubClientPath, 'hubList', req),
);

wishWashRouter.get('/hubList/favicon.ico', (req) =>
  staticFile(hubClientPath, 'hubList', req),
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

  const data: HubWishlistData = {
    id: wishList.id,
    title: snapshot.title,
    // TODO: figure out how to get item data...
  } as any;

  const appHtml = serverRender(data);
  return renderTemplate(indexTemplate, appHtml, data);
});

wishWashRouter.get('/hubList/*', (req) =>
  staticFile(hubClientPath, 'hubList', req),
);

interface WishlistSnapshot {
  title: string;
}
