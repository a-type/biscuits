import { createDb, DB } from '@biscuits/db';
import { getLibraryName } from '@biscuits/libraries';
import type { ListSnapshot as WishlistSnapshot } from '@wish-wash.biscuits/verdant';
import { WorkerEntrypoint } from 'cloudflare:workers';
import { PublicWishlistData } from '../graphql/otherTypes.js';
import { itemImageUrls } from '../graphql/types/wishWash/public.js';

export class WishWashRpc extends WorkerEntrypoint {
	#db: DB;
	constructor(ctx: ExecutionContext, env: Env) {
		super(ctx, env);
		this.#db = createDb(env.CORE_DB);
	}

	async getPublicWishlist(id: string) {
		const wishList = await this.#db
			.selectFrom('PublishedWishlist')
			.leftJoin('User', 'PublishedWishlist.publishedBy', 'User.id')
			.select([
				'PublishedWishlist.id',
				'User.fullName as publisherFullName',
				'PublishedWishlist.planId',
				'PublishedWishlist.publishedBy',
				'PublishedWishlist.slug',
			])
			.where('PublishedWishlist.id', '=', id)
			.executeTakeFirst();

		if (!wishList) {
			return null;
		}

		const libraryName = getLibraryName({
			planId: wishList.planId,
			app: 'wish-wash',
			access: 'members',
			userId: wishList.publishedBy,
		});
		const library = await this.env.VERDANT_LIBRARY.getByName(libraryName);

		const snapshot = (await library.getDocumentSnapshot(
			'lists',
			wishList.id,
		)) as WishlistSnapshot | null;

		if (!snapshot) {
			return null;
		}

		const purchases = await this.#db
			.selectFrom('WishlistPurchase')
			.where('WishlistPurchase.wishlistId', '=', wishList.id)
			// confirmed means the user knows about it, which means it will be included in the purchasedCount
			// already.
			.where('WishlistPurchase.confirmedAt', 'is', null)
			.select([
				'WishlistPurchase.itemId',
				'WishlistPurchase.quantity',
				'WishlistPurchase.confirmedAt',
			])
			.execute();

		const data: PublicWishlistData = {
			id: wishList.id,
			title: snapshot.name,
			slug: wishList.slug,
			author: wishList.publisherFullName ?? 'Someone',
			coverImageUrl: snapshot.coverImage?.url,
			createdAt: snapshot.createdAt,
			description: snapshot.description,
			// mapping manually here to avoid leaking unintended data.
			items: snapshot.items.map((item) => {
				// do not show the user unconfirmed purchases
				const purchasesForThisItem = purchases
					.filter((p) => p.itemId === item.id)
					.reduce((acc, p) => acc + p.quantity, 0);
				return {
					id: item.id,
					description: item.description,
					count: item.count,
					purchasedCount: item.purchasedCount + purchasesForThisItem,
					links: item.links,
					prioritized: item.prioritized,
					imageUrls: itemImageUrls(item),
					createdAt: item.createdAt,
					note: item.note,
					priceMin: item.priceMin ?? null,
					priceMax: item.priceMax ?? null,
					type: item.type,
					prompt: item.prompt,
					remoteImageUrl: item.remoteImageUrl,
				};
			}),
		};
	}
}
