import { Session } from '@a-type/auth';
import { db } from '@biscuits/db';
import { getLibraryName } from '@biscuits/libraries';
import { type HubWishlistData } from '@wish-wash.biscuits/hub';
import type { ListSnapshot as WishlistSnapshot } from '@wish-wash.biscuits/verdant';
import * as fsSync from 'fs';
import { Hono } from 'hono';
import * as path from 'path';
import { sessions } from '../auth/session.js';
import { renderTemplate, staticFile } from '../common/hubs.js';
import { Env } from '../config/hono.js';
import { verdantServer } from '../verdant/verdant.js';

export const wishWashRouter = new Hono<Env>();

const hubPath = path.join(
	process.cwd(),
	'..',
	'apps',
	'wish-wash',
	'hub',
	'dist',
);
const hubClientPath = path.join(hubPath, 'client');

wishWashRouter.get('/hub/assets/*', ({ req }) =>
	staticFile(hubClientPath, 'wish-wash/hub', req.raw),
);

wishWashRouter.get('/hub/favicon.ico', ({ req }) =>
	staticFile(hubClientPath, 'wish-wash/hub', req.raw),
);

function itemImageUrls(item: WishlistSnapshot['items'][number]) {
	const imageUrls = item.imageFiles
		.map((f) => f.url)
		.filter((url): url is string => !!url);
	if (item.remoteImageUrl) {
		imageUrls.push(item.remoteImageUrl);
	}
	return imageUrls;
}

wishWashRouter.get('/hub/:listSlug', async (ctx) => {
	const listSlug = ctx.req.param('listSlug');
	// parse slug out of fragment
	const slug = listSlug.split('-').pop()!;

	const wishList = await db
		.selectFrom('PublishedWishlist')
		.leftJoin('User', 'PublishedWishlist.publishedBy', 'User.id')
		.select([
			'PublishedWishlist.id',
			'User.fullName as publisherFullName',
			'PublishedWishlist.planId',
			'PublishedWishlist.publishedBy',
			'PublishedWishlist.slug',
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
		session = await sessions.getSession(ctx);
	} catch (err) {
		// that's fine
	}
	// is this the user's list?
	const isUsersList = session?.userId === wishList.publishedBy;

	const data: HubWishlistData = {
		id: wishList.id,
		title: snapshot.name,
		slug: wishList.slug,
		hidePurchases: isUsersList,
		author: wishList.publisherFullName ?? 'Someone',
		// mapping manually here to avoid leaking unintended data.
		items: snapshot.items.map((item) => ({
			id: item.id,
			description: item.description,
			count: item.count,
			purchasedCount: item.purchasedCount,
			links: item.links,
			prioritized: item.prioritized,
			imageUrls: itemImageUrls(item),
			createdAt: item.createdAt,
			note: item.note,
			priceMin: item.priceMin ?? null,
			priceMax: item.priceMax ?? null,
			type: item.type,
		})),
	};

	const indexTemplate = fsSync.readFileSync(
		path.join(hubClientPath, 'index.html'),
		'utf8',
	);

	const { serverRender } = await import('@wish-wash.biscuits/hub');
	const appHtml = serverRender(data);
	return renderTemplate(indexTemplate, { appHtml, data });
});

wishWashRouter.get('/hub/*', ({ req }) =>
	staticFile(hubClientPath, 'wish-wash/hub', req.raw),
);
