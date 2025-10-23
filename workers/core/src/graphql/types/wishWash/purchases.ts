import { id } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import { builder } from '../../builder.js';
import { assignTypeName } from '../../relay.js';

builder.queryFields((t) => ({
	wishlistPurchases: t.field({
		type: ['WishlistPurchase'],
		authScopes: {
			app: 'wish-wash',
		},
		args: {
			wishlistId: t.arg({
				type: 'ID',
				required: true,
			}),
			includeConfirmed: t.arg({
				type: 'Boolean',
				required: false,
			}),
		},
		resolve: async (_, args, context) => {
			let query = context.db
				.selectFrom('WishlistPurchase')
				.selectAll()
				.where('wishlistId', '=', args.wishlistId);

			if (!args.includeConfirmed) {
				query = query.where('confirmedAt', 'is', null);
			}

			const purchases = await query.execute();
			return purchases.map(assignTypeName('WishlistPurchase'));
		},
	}),
}));

builder.mutationFields((t) => ({
	confirmPurchases: t.field({
		args: {
			purchaseIds: t.arg({
				type: ['ID'],
				required: true,
			}),
		},
		type: 'Boolean',
		authScopes: {
			app: 'wish-wash',
		},
		resolve: async (_, { purchaseIds }, context) => {
			await context.db
				.updateTable('WishlistPurchase')
				.set({ confirmedAt: new Date() })
				.where('id', 'in', purchaseIds)
				.execute();
			return true;
		},
	}),
	purchasePublicItem: t.field({
		args: {
			input: t.arg({
				type: 'PurchasePublicItemInput',
				required: true,
			}),
		},
		type: 'Boolean',
		authScopes: {
			public: true,
		},
		resolve: async (_, { input }, context) => {
			const wishlist = await context.db
				.selectFrom('PublishedWishlist')
				.select(['id'])
				.where('slug', '=', input.wishlistSlug)
				.executeTakeFirst();

			if (!wishlist) {
				throw new BiscuitsError(BiscuitsError.Code.NotFound);
			}

			await context.db
				.insertInto('WishlistPurchase')
				.values({
					wishlistId: wishlist.id,
					itemId: input.itemId,
					purchasedBy: input.name,
					quantity: input.quantity,
					id: id(),
				})
				.execute();

			return true;
		},
	}),
}));

builder.objectType('WishlistPurchase', {
	fields: (t) => ({
		id: t.exposeID('id'),
		itemId: t.exposeID('itemId'),
		createdAt: t.expose('createdAt', {
			type: 'DateTime',
		}),
		purchasedBy: t.exposeID('purchasedBy'),
		quantity: t.exposeInt('quantity'),
		confirmedAt: t.expose('confirmedAt', {
			type: 'DateTime',
			nullable: true,
		}),
	}),
});

builder.inputType('PurchasePublicItemInput', {
	fields: (t) => ({
		wishlistSlug: t.string({
			required: true,
		}),
		itemId: t.id({
			required: true,
		}),
		quantity: t.int({
			required: true,
		}),
		name: t.string({
			required: true,
		}),
	}),
});
