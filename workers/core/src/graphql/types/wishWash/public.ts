import { builder } from '../../builder.js';
import { assignTypeName } from '../../relay.js';

builder.queryFields((t) => ({
	publicWishlist: t.field({
		type: 'PublishedWishlist',
		authScopes: {
			public: true,
		},
		nullable: true,
		args: {
			id: t.arg.id({
				required: true,
			}),
		},
		resolve: async (_, { id }, ctx) => {
			const wishList = await ctx.db
				.selectFrom('PublishedWishlist')
				.selectAll()
				.where('PublishedWishlist.id', '=', id)
				.executeTakeFirst();

			if (!wishList || !wishList.data || !Object.keys(wishList.data).length) {
				return null;
			}

			return assignTypeName('PublishedWishlist')(wishList);
		},
	}),
}));
