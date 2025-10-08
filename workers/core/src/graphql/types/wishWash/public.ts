import { getLibraryName } from '@biscuits/libraries';
import { HubWishlistData } from '@wish-wash.biscuits/hub';
import type { ListSnapshot as WishlistSnapshot } from '@wish-wash.biscuits/verdant';
import { builder } from '../../builder.js';
import { assignTypeName } from '../../relay.js';

builder.queryFields((t) => ({
	publicWishlist: t.field({
		type: 'PublicWishlist',
		authScopes: {
			public: true,
		},
		nullable: true,
		args: {
			id: t.arg.id({
				required: true,
			}),
			hidePurchases: t.arg.boolean({
				required: false,
				defaultValue: false,
			}),
		},
		resolve: async (_, { id, hidePurchases: userHidePurchases }, ctx) => {
			const wishList = await ctx.db
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
			const library =
				await ctx.reqCtx.env.VERDANT_LIBRARY.getByName(libraryName);

			const snapshot = (await library.getDocumentSnapshot(
				'lists',
				wishList.id,
			)) as WishlistSnapshot | null;

			if (!snapshot) {
				return null;
			}

			const purchases = await ctx.db
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

			const isUsersList = ctx.session?.userId === wishList.publishedBy;
			// if it's the user's own list, hide purchases unless they pass false
			const hidePurchases =
				userHidePurchases || (isUsersList && userHidePurchases !== false);

			const data: HubWishlistData = {
				id: wishList.id,
				title: snapshot.name,
				slug: wishList.slug,
				hidePurchases: !!hidePurchases,
				author: wishList.publisherFullName ?? 'Someone',
				coverImageUrl: snapshot.coverImage?.url,
				createdAt: snapshot.createdAt,
				description: snapshot.description,
				// mapping manually here to avoid leaking unintended data.
				items: snapshot.items
					.map((item) => {
						// do not show the user unconfirmed purchases
						const purchasesForThisItem =
							hidePurchases ? 0 : (
								purchases
									.filter((p) => p.itemId === item.id)
									.reduce((acc, p) => acc + p.quantity, 0)
							);
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
					})
					.sort((a, b) => {
						// purchased last
						if (a.purchasedCount >= a.count) {
							return 1;
						}
						if (b.purchasedCount >= b.count) {
							return -1;
						}
						// prioritized first
						if (a.prioritized && !b.prioritized) {
							return -1;
						}
						if (!a.prioritized && b.prioritized) {
							return 1;
						}
						// then by createdAt
						return (
							new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
						);
					}),
			};
			return assignTypeName('PublicWishlist')(data);
		},
	}),
}));

export function itemImageUrls(item: WishlistSnapshot['items'][number]) {
	const imageUrls = item.imageFiles
		.map((f) => f.url)
		.filter((url): url is string => !!url);
	if (item.remoteImageUrl) {
		imageUrls.push(item.remoteImageUrl);
	}
	return imageUrls;
}

builder.objectType('PublicWishlist', {
	fields: (t) => ({
		id: t.exposeID('id'),
		title: t.exposeString('title'),
		slug: t.exposeString('slug'),
		author: t.exposeString('author'),
		coverImageUrl: t.exposeString('coverImageUrl', { nullable: true }),
		createdAt: t.field({
			type: 'DateTime',
			resolve: (parent) => new Date(parent.createdAt),
		}),
		description: t.exposeString('description', { nullable: true }),
		hidePurchases: t.exposeBoolean('hidePurchases', {
			nullable: true,
		}),
		items: t.field({
			type: ['PublicWishlistItem'],
			resolve: (parent) => {
				return parent.items.map(assignTypeName('PublicWishlistItem'));
			},
		}),
	}),
});

builder.objectType('PublicWishlistItem', {
	fields: (t) => ({
		id: t.exposeID('id'),
		description: t.exposeString('description'),
		count: t.exposeInt('count'),
		prioritized: t.exposeBoolean('prioritized'),
		imageUrls: t.field({
			type: ['String'],
			resolve: (parent) => parent.imageUrls,
		}),
		links: t.field({
			type: ['String'],
			resolve: (parent) => parent.links,
		}),
		createdAt: t.field({
			type: 'DateTime',
			resolve: (parent) => new Date(parent.createdAt),
		}),
		purchasedCount: t.exposeInt('purchasedCount'),
		priceMin: t.exposeString('priceMin', { nullable: true }),
		priceMax: t.exposeString('priceMax', { nullable: true }),
		note: t.exposeString('note', { nullable: true }),
		type: t.field({
			type: PublicWishlistItemType,
			resolve: (parent) => parent.type,
		}),
		prompt: t.exposeString('prompt', { nullable: true }),
		remoteImageUrl: t.exposeString('remoteImageUrl', { nullable: true }),
	}),
});

export const PublicWishlistItemType = builder.enumType(
	'PublicWishlistItemType',
	{
		values: ['link', 'idea', 'vibe'],
	},
);
