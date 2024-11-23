import { BiscuitsError } from '@biscuits/error';
import { builder } from '../../builder.js';
import { assignTypeName, hasTypeName } from '../../relay.js';
import cuid2 from '@paralleldrive/cuid2';
import { WISH_WASH_HUB_ORIGIN } from '../../../config/deployedContext.js';

builder.queryFields((t) => ({
	wishlistIdeaRequest: t.field({
		type: 'WishlistIdeaRequest',
		nullable: true,
		args: {
			id: t.arg.id({
				required: true,
			}),
		},
		resolve: async (_, { id }, ctx) => {
			const wishlistIdeaRequest = await ctx.db
				.selectFrom('WishlistIdeaRequest')
				.selectAll()
				.where('id', '=', id)
				.executeTakeFirst();
			if (!wishlistIdeaRequest) return null;
			return assignTypeName('WishlistIdeaRequest')(wishlistIdeaRequest);
		},
	}),

	wishlistRelatedIdeaRequests: t.field({
		type: ['WishlistIdeaRequest'],
		args: {
			wishlistId: t.arg.id({
				required: true,
			}),
		},
		authScopes: {
			member: true,
		},
		resolve: async (_, { wishlistId }, ctx) => {
			const { planId } = ctx.session ?? {};
			if (!planId) {
				throw new BiscuitsError(
					BiscuitsError.Code.Forbidden,
					'You must be a member to view wishlist idea requests',
				);
			}
			const wishlistIdeaRequests = await ctx.db
				.selectFrom('WishlistIdeaRequest')
				.selectAll()
				.where('wishlistId', '=', wishlistId)
				.where('planId', '=', planId)
				.execute();
			return wishlistIdeaRequests.map(assignTypeName('WishlistIdeaRequest'));
		},
	}),
}));

builder.mutationFields((t) => ({
	requestWishlistIdeas: t.field({
		type: 'WishlistIdeaRequest',
		authScopes: {
			member: true,
		},
		args: {
			input: t.arg({
				type: 'WishlistIdeaRequestCreateInput',
				required: true,
			}),
		},
		resolve: async (_, { input }, ctx) => {
			const { wishlistId, name } = input;
			const planId = ctx.session?.planId;
			const userId = ctx.session?.userId;
			if (!planId || !userId) {
				throw new BiscuitsError(
					BiscuitsError.Code.Forbidden,
					'You must be a member to request wishlist ideas',
				);
			}
			const wishlistIdeaRequest = await ctx.db
				.insertInto('WishlistIdeaRequest')
				.values({
					id: cuid2.createId(),
					createdAt: new Date(),
					updatedAt: new Date(),
					wishlistId,
					requestedBy: userId,
					receiverName: name,
					planId,
				})
				.returningAll()
				.executeTakeFirst();
			if (!wishlistIdeaRequest) {
				throw new BiscuitsError(
					BiscuitsError.Code.Unexpected,
					'Failed to create wishlist idea request',
				);
			}
			return assignTypeName('WishlistIdeaRequest')(wishlistIdeaRequest);
		},
	}),

	respondToWishlistIdeaRequest: t.field({
		type: 'WishlistIdeaRequest',
		authScopes: {
			public: true,
		},
		args: {
			input: t.arg({
				type: 'WishlistIdeaRequestResponseInput',
				required: true,
			}),
		},
		resolve: async (_, { input }, ctx) => {
			const { ideaRequestId, responses } = input;

			const wishlistIdeaRequest = await ctx.db
				.selectFrom('WishlistIdeaRequest')
				.selectAll()
				.where('id', '=', ideaRequestId)
				.executeTakeFirst();

			if (!wishlistIdeaRequest) {
				throw new BiscuitsError(
					BiscuitsError.Code.NotFound,
					'Wishlist idea request not found',
				);
			}

			const result = await ctx.db
				.updateTable('WishlistIdeaRequest')
				.set({
					updatedAt: new Date(),
					responseJson: responses,
				})
				.where('id', '=', ideaRequestId)
				.returningAll()
				.executeTakeFirst();

			if (!result) {
				throw new BiscuitsError(
					BiscuitsError.Code.Unexpected,
					'Failed to update wishlist idea request',
				);
			}

			return assignTypeName('WishlistIdeaRequest')(result);
		},
	}),
}));

builder.objectType('WishlistIdeaRequest', {
	description:
		'A request by a user for ideas for a shopping list for a particular person',

	isTypeOf: hasTypeName('WishlistIdeaRequest'),
	fields: (t) => ({
		id: t.exposeID('id'),
		createdAt: t.expose('createdAt', {
			type: 'DateTime',
		}),
		url: t.string({
			resolve: (source) => {
				return WISH_WASH_HUB_ORIGIN + `/req/${source.id}`;
			},
		}),
		response: t.field({
			type: 'JSON',
			nullable: true,
			resolve: (source) => {
				return source.responseJson;
			},
		}),
	}),
});

builder.inputType('WishlistIdeaRequestCreateInput', {
	description: 'Input for creating a new WishlistIdeaRequest',
	fields: (t) => ({
		wishlistId: t.id({
			required: true,
		}),
		name: t.string({
			required: true,
		}),
	}),
});

builder.inputType('WishlistIdeaRequestResponseInput', {
	description: 'Input for responding to a WishlistIdeaRequest',
	fields: (t) => ({
		ideaRequestId: t.id({
			required: true,
		}),
		responses: t.field({
			required: true,
			type: 'JSON',
		}) as any,
	}),
});
