import { builder } from '../../builder.js';
import { assignTypeName } from '../../relay.js';

builder.queryFields((t) => ({
	publicRecipe: t.field({
		type: 'PublicRecipe',
		authScopes: {
			public: true,
		},
		nullable: true,
		args: {
			planId: t.arg.id({
				required: true,
			}),
			slug: t.arg.string({
				required: true,
			}),
		},
		resolve: async (_, { planId, slug }, ctx) => {
			const recipeSlug = slug.split('-').pop()!;
			const recipe = await ctx.db
				.selectFrom('PublishedRecipe')
				.leftJoin('User', 'PublishedRecipe.publishedBy', 'User.id')
				.select([
					'PublishedRecipe.id',
					'User.fullName as publisherFullName',
					'PublishedRecipe.publishedBy',
					'PublishedRecipe.planId',
					'PublishedRecipe.data',
				])
				.where('slug', '=', recipeSlug)
				.where('PublishedRecipe.planId', '=', planId)
				.executeTakeFirst();

			if (!recipe) {
				return null;
			}

			if (!recipe.data || !Object.keys(recipe.data).length) {
				return null;
			}

			return assignTypeName('PublicRecipe')(recipe);
		},
	}),
}));

builder.objectType('PublicRecipe', {
	fields: (t) => ({
		id: t.field({
			type: 'ID',
			resolve: (recipe) => recipe.data.id,
		}),
		title: t.field({
			type: 'String',
			resolve: (recipe) => recipe.data.title,
		}),
		prelude: t.field({
			type: 'JSON',
			resolve: (recipe) => recipe.data.prelude,
		}),
		mainImageUrl: t.field({
			type: 'String',
			nullable: true,
			resolve: (recipe) => recipe.data.mainImageUrl,
		}),
		ingredients: t.field({
			type: ['PublicRecipeIngredient'],
			resolve: (recipe) =>
				recipe.data.ingredients.map(assignTypeName('PublicRecipeIngredient')),
		}),
		instructions: t.field({
			type: 'JSON',
			resolve: (recipe) => recipe.data.instructions,
		}),
		publisher: t.field({
			type: 'PublicRecipePublisher',
			resolve: (recipe) => ({
				fullName: recipe.publisherFullName ?? 'Anonymous',
			}),
		}),
		note: t.field({
			type: 'String',
			nullable: true,
			resolve: (recipe) => recipe.data.note,
		}),
		servings: t.field({
			type: 'Int',
			nullable: true,
			resolve: (recipe) => recipe.data.servings,
		}),
		prepTimeMinutes: t.field({
			type: 'Int',
			nullable: true,
			resolve: (recipe) => recipe.data.prepTimeMinutes,
		}),
		cookTimeMinutes: t.field({
			type: 'Int',
			nullable: true,
			resolve: (recipe) => recipe.data.cookTimeMinutes,
		}),
		totalTimeMinutes: t.field({
			type: 'Int',
			nullable: true,
			resolve: (recipe) => recipe.data.totalTimeMinutes,
		}),

		embeddedRecipes: t.field({
			type: ['PublicRecipe'],
			resolve: async (recipe, _, ctx) => {
				return recipe.data.subRecipes
					.map((subRecipe) => ({
						data: subRecipe,
						// fill in rest of the data from parent.
						planId: recipe.planId,
						publishedBy: recipe.publishedBy,
						publisherFullName: recipe.publisherFullName,
					}))
					.map(assignTypeName('PublicRecipe'));
			},
		}),
	}),
});

builder.objectType('PublicRecipePublisher', {
	fields: (t) => ({
		fullName: t.exposeString('fullName'),
	}),
});

builder.objectType('PublicRecipeIngredient', {
	fields: (t) => ({
		text: t.exposeString('text'),
		comments: t.field({
			type: ['String'],
			resolve: (ingredient) => ingredient.comments,
		}),
		quantity: t.exposeFloat('quantity'),
		unit: t.exposeString('unit', { nullable: true }),
		isSectionHeader: t.exposeBoolean('isSectionHeader'),
		food: t.exposeString('food', { nullable: true }),
		id: t.exposeID('id'),
		note: t.exposeString('note', { nullable: true }),
	}),
});
