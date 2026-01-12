import { appsById } from '@biscuits/apps';
import { userNameSelector, WishlistPurchase } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import {
	PublicWishlistItem,
	publicWishlistSchema,
} from '@wish-wash.biscuits/share-schema';
import { getTld } from '../../../services/domainRoutes.js';
import { builder } from '../../builder.js';
import { assignTypeName, hasTypeName } from '../../relay.js';

builder.queryFields((t) => ({
	publishedWishlist: t.field({
		type: 'PublishedWishlist',
		authScopes: {
			app: 'wish-wash',
		},
		nullable: true,
		args: {
			id: t.arg.id({
				required: true,
			}),
		},
		resolve: async (_, { id }, ctx) => {
			const planId = ctx.session?.planId;
			if (!planId) {
				throw new BiscuitsError(
					BiscuitsError.Code.Forbidden,
					'You must be a member to view a published wishlist',
				);
			}

			const publishedWishlist = await ctx.db
				.selectFrom('PublishedWishlist')
				.selectAll()
				.where('id', '=', id)
				.where('planId', '=', planId)
				.executeTakeFirst();

			if (!publishedWishlist) return null;

			return assignTypeName('PublishedWishlist')(publishedWishlist);
		},
	}),
}));

builder.mutationFields((t) => ({
	publishWishlist: t.field({
		type: 'PublishedWishlist',
		authScopes: {
			app: 'wish-wash',
		},
		args: {
			input: t.arg({
				type: 'PublishWishlistInput',
				required: true,
			}),
		},
		resolve: async (_, { input }, ctx) => {
			const { id } = input;
			const planId = ctx.session?.planId;
			const userId = ctx.session?.userId;
			if (!planId || !userId) {
				throw new BiscuitsError(
					BiscuitsError.Code.Forbidden,
					'You must be create an account to publish a wishlist',
				);
			}

			// free users can only publish one list
			if (!ctx.session?.planHasSubscription) {
				const existingPublishedWishlist = await ctx.db
					.selectFrom('PublishedWishlist')
					.selectAll()
					.where('planId', '=', planId)
					.executeTakeFirst();

				if (existingPublishedWishlist) {
					throw new BiscuitsError(
						BiscuitsError.Code.Forbidden,
						'Free users can only publish one wishlist',
					);
				}
			}

			const valid = publicWishlistSchema.safeParse(input.data);
			if (!valid.success) {
				throw new BiscuitsError(
					BiscuitsError.Code.BadRequest,
					`Invalid wishlist data: ${valid.error.message}`,
					{ details: valid.error.issues },
				);
			}
			if (valid.data.id !== input.id) {
				throw new BiscuitsError(
					BiscuitsError.Code.BadRequest,
					`Wishlist data ID does not match input ID. Input ID is ${input.id}, but data ID is ${valid.data.id}`,
				);
			}

			const wishlist = await ctx.db
				.insertInto('PublishedWishlist')
				.values({
					id,
					planId,
					slug: id,
					publishedAt: new Date(),
					publishedBy: userId,
					data: valid.data,
				})
				.onConflict((oc) =>
					oc.column('id').where('planId', '=', planId).doUpdateSet({
						publishedAt: new Date(),
						publishedBy: userId,
						data: valid.data,
					}),
				)
				.returningAll()
				.executeTakeFirstOrThrow();

			return assignTypeName('PublishedWishlist')(wishlist);
		},
	}),

	unpublishWishlist: t.field({
		type: 'ID',
		authScopes: {
			member: true,
		},
		args: {
			wishlistId: t.arg.id({
				required: true,
			}),
		},
		resolve: async (_, { wishlistId }, ctx) => {
			const planId = ctx.session?.planId;
			if (!planId) {
				throw new BiscuitsError(
					BiscuitsError.Code.Forbidden,
					'You must be a member to unpublish a wishlist',
				);
			}

			await ctx.db
				.deleteFrom('PublishedWishlist')
				.where('id', '=', wishlistId)
				.where('planId', '=', planId)
				.execute();

			return wishlistId;
		},
	}),
}));

builder.objectType('PublishedWishlist', {
	description: 'A published wishlist',

	isTypeOf: hasTypeName('PublishedWishlist'),
	fields: (t) => ({
		id: t.exposeID('id'),
		publishedAt: t.expose('publishedAt', {
			type: 'DateTime',
		}),
		slug: t.exposeString('slug'),
		url: t.string({
			resolve: async (source, _, ctx) => {
				// try domain route first
				const route = await ctx.db
					.selectFrom('DomainRoute')
					.select(['DomainRoute.domain', 'DomainRoute.dnsVerifiedAt'])
					.where('resourceId', '=', source.planId)
					.where('appId', '=', 'wish-wash')
					.executeTakeFirst();
				if (route && route.dnsVerifiedAt) {
					return `https://${route.domain}`;
				}

				const deployedOrigin = new URL(ctx.reqCtx.env.DEPLOYED_ORIGIN);
				const routed = appsById['wish-wash'].domainRoutes!(source.id, {
					tld: getTld(deployedOrigin.hostname),
				});
				const pubUrl = new URL(routed);
				return pubUrl.toString();
			},
		}),
		author: t.field({
			type: 'PublishedWishlistAuthor',
			resolve: async (source, _, ctx) => {
				const planMember = await ctx.db
					.selectFrom('User')
					.select('User.imageUrl')
					.select(userNameSelector)
					.where('User.id', '=', source.publishedBy)
					.executeTakeFirst();

				return assignTypeName('PublishedWishlistAuthor')({
					name: planMember?.name ?? 'Anonymous',
					profileImageUrl: planMember?.imageUrl ?? null,
				});
			},
		}),

		data: t.field({
			type: 'PublishedWishlistData',
			resolve: (source) => {
				return assignTypeName('PublishedWishlistData')({
					// @ts-ignore
					id: source.id,
					// @ts-ignore
					title: '',
					wishlist: source,
					...source.data,
				});
			},
		}),
	}),
});

builder.objectType('PublishedWishlistData', {
	description: 'The data snapshot of a published wishlist',

	isTypeOf: hasTypeName('PublishedWishlistData'),
	fields: (t) => ({
		id: t.exposeID('id'),
		title: t.exposeString('title'),
		description: t.exposeString('description', { nullable: true }),
		coverImageUrl: t.exposeString('coverImageUrl', { nullable: true }),
		hidePurchases: t.exposeBoolean('hidePurchases', { nullable: true }),
		items: t.field({
			type: ['PublishedWishlistItem'],
			resolve: async (source, { hidePurchases: userHidePurchases }, ctx) => {
				const purchases = await ctx.dataloaders.wishlistPurchasesLoader.load(
					source.id,
				);
				if (purchases instanceof BiscuitsError) {
					throw purchases;
				}
				const isUsersList = ctx.session?.userId === source.wishlist.publishedBy;
				userHidePurchases || (isUsersList && userHidePurchases !== false);
				return processItems(
					source.items,
					purchases,
					!!source.hidePurchases,
				).map((item) => assignTypeName('PublishedWishlistItem')(item));
			},
		}),
	}),
});

builder.objectType('PublishedWishlistItem', {
	description: 'An item in a published wishlist',

	isTypeOf: hasTypeName('PublishedWishlistItem'),
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
			type: ItemType,
			resolve: (parent) => parent.type,
		}),
		prompt: t.exposeString('prompt', { nullable: true }),
		remoteImageUrl: t.exposeString('remoteImageUrl', { nullable: true }),
	}),
});

builder.objectType('PublishedWishlistAuthor', {
	description: 'Author information for a published wishlist',

	isTypeOf: hasTypeName('PublishedWishlistAuthor'),
	fields: (t) => ({
		name: t.exposeString('name'),
		profileImageUrl: t.exposeString('profileImageUrl', { nullable: true }),
	}),
});

builder.inputType('PublishWishlistInput', {
	fields: (t) => ({
		id: t.id({
			description: 'The ID of the wishlist to publish',
			required: true,
		}),
		data: t.field({
			description: 'The data snapshot of the wishlist to publish',
			type: 'JSON',
			required: true,
		}),
	}),
});

const ItemType = builder.enumType('PublishedWishlistItemType', {
	values: ['link', 'idea', 'vibe'] as const,
});

function processItems(
	items: PublicWishlistItem[],
	purchases: Pick<WishlistPurchase, 'quantity' | 'itemId'>[],
	hidePurchases: boolean,
) {
	return items
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
				imageUrls: item.imageUrls,
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
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		});
}
