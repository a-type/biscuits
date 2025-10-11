import { BiscuitsError } from '@biscuits/error';
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

			const wishlist = await ctx.db
				.insertInto('PublishedWishlist')
				.values({
					id,
					planId,
					slug: id,
					publishedAt: new Date(),
					publishedBy: userId,
				})
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
		url: t.string({
			resolve: (source, _, ctx) => {
				const pubUrl = new URL(ctx.reqCtx.env.WISH_WASH_HUB_ORIGIN);
				if (pubUrl.hostname.includes('localhost')) {
					pubUrl.searchParams.set('listId', source.id);
				} else {
					pubUrl.hostname = `${source.id}.${pubUrl.hostname}`;
				}
				return pubUrl.toString();
			},
		}),
		slug: t.exposeString('slug', {
			nullable: true,
			description: 'The slug of the wishlist',
		}),
	}),
});

builder.inputType('PublishWishlistInput', {
	fields: (t) => ({
		id: t.id({
			description: 'The ID of the wishlist to publish',
			required: true,
		}),
	}),
});
