import { BiscuitsError } from '@biscuits/error';
import { decodeGlobalID } from '@pothos/plugin-relay';
import { logger } from '../../../logger.js';
import {
	FoodCategory as DBFoodCategory,
	id,
} from '../../../services/db/index.js';
import { builder } from '../../builder.js';
import { GQLContext } from '../../context.js';
import { createResults, keyIndexes } from '../../dataloaders/index.js';
import { assignTypeName } from '../../relay.js';

async function getAllCategories(ctx: GQLContext) {
	const categories = await ctx.db
		.selectFrom('FoodCategory')
		.selectAll()
		.orderBy('sortKey')
		.execute();

	return categories.map(assignTypeName('FoodCategory'));
}

builder.queryFields((t) => ({
	foodCategories: t.field({
		type: [FoodCategory],
		resolve: (_, __, ctx) => getAllCategories(ctx),
	}),
}));

builder.mutationFields((t) => ({
	createCategory: t.field({
		type: 'CreateCategoryResult',
		authScopes: {
			productAdmin: true,
		},
		args: {
			input: t.arg({
				type: 'CreateCategoryInput',
				required: true,
			}),
		},
		resolve: async (_, { input }, ctx) => {
			const category = await ctx.db
				.insertInto('FoodCategory')
				.values({
					id: id(),
					name: input.name,
					sortKey: input.sortKey,
				})
				.returning('id')
				.executeTakeFirst();

			if (!category) {
				logger.urgent('Failed to create category', input.name);
				throw new BiscuitsError(BiscuitsError.Code.Unexpected);
			}

			return { categoryId: category.id };
		},
	}),

	updateCategory: t.field({
		type: 'UpdateCategoryResult',
		authScopes: {
			productAdmin: true,
		},
		args: {
			input: t.arg({
				type: 'UpdateCategoryInput',
				required: true,
			}),
		},
		resolve: async (_, { input }, ctx) => {
			const id = decodeGlobalID(input.id as string);
			const category = await ctx.db
				.updateTable('FoodCategory')
				.set({
					name: input.name ?? undefined,
					sortKey: input.sortKey ?? undefined,
				})
				.where('id', '=', id.id)
				.returning('id')
				.executeTakeFirst();

			if (!category) {
				logger.urgent('Failed to update category', input.id);
				throw new BiscuitsError(BiscuitsError.Code.Unexpected);
			}

			return { categoryId: category.id };
		},
	}),

	deleteCategory: t.field({
		type: 'DeleteCategoryResult',
		authScopes: {
			productAdmin: true,
		},
		args: {
			categoryId: t.arg.globalID({
				required: true,
			}),
		},
		resolve: async (_, { categoryId }, ctx) => {
			const category = await ctx.db
				.deleteFrom('FoodCategory')
				.where('id', '=', categoryId.id)
				.returning('id')
				.executeTakeFirst();

			if (!category) {
				logger.urgent('Failed to delete category', categoryId);
				throw new BiscuitsError(BiscuitsError.Code.Unexpected);
			}

			return { categoryId: category.id };
		},
	}),
}));

export const FoodCategory = builder.loadableNodeRef('FoodCategory', {
	load: async (ids, ctx) => {
		const categories = await ctx.db
			.selectFrom('FoodCategory')
			.selectAll()
			.where('id', 'in', ids as string[])
			.execute();

		const indexes = keyIndexes(ids);

		const results = createResults<
			DBFoodCategory & { __typename: 'FoodCategory' }
		>(ids);
		for (const result of categories) {
			results[indexes[result.id]] = assignTypeName('FoodCategory')(result);
		}

		return results;
	},
	id: {
		resolve: (category) => category.id,
	},
});
FoodCategory.implement({
	description: 'A grocery store category in Gnocchi',
	fields: (t) => ({
		name: t.exposeString('name'),
		sortKey: t.exposeString('sortKey'),
	}),
});

builder.objectType('CreateCategoryResult', {
	fields: (t) => ({
		categories: t.field({
			type: [FoodCategory],
			resolve: (_, __, ctx) => getAllCategories(ctx),
		}),
	}),
});

builder.inputType('CreateCategoryInput', {
	fields: (t) => ({
		name: t.field({ type: 'String', required: true }),
		sortKey: t.field({ type: 'String', required: true }),
	}),
});

builder.objectType('UpdateCategoryResult', {
	fields: (t) => ({
		categories: t.field({
			type: [FoodCategory],
			resolve: (_, __, ctx) => getAllCategories(ctx),
		}),
	}),
});

builder.inputType('UpdateCategoryInput', {
	fields: (t) => ({
		id: t.id({ required: true }),
		name: t.field({ type: 'String' }),
		sortKey: t.field({ type: 'String' }),
	}),
});

builder.objectType('DeleteCategoryResult', {
	fields: (t) => ({
		categories: t.field({
			type: [FoodCategory],
			resolve: (_, __, ctx) => getAllCategories(ctx),
		}),
	}),
});
