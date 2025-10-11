import { getLibraryName } from '@biscuits/libraries';
import { LibraryApi } from '@verdant-web/server';
import { loadRecipeData } from '../../../routers/gnocchi.js';
import { builder } from '../../builder.js';
import { PublicRecipeData } from '../../otherTypes.js';
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
				])
				.where('slug', '=', recipeSlug)
				.where('PublishedRecipe.planId', '=', planId)
				.executeTakeFirst();

			if (!recipe) {
				return null;
			}

			const libraryName = getLibraryName({
				planId,
				app: 'gnocchi',
				access: 'members',
				userId: recipe.publishedBy,
			});
			const library =
				await ctx.reqCtx.env.VERDANT_LIBRARY.getByName(libraryName);

			const data = await loadRecipeData(
				recipe.id,
				{
					id: recipe.publishedBy,
					planId,
					fullName: recipe.publisherFullName ?? 'Anonymous',
				},
				library,
			);

			if (!data) return null;

			return assignTypeName('PublicRecipe')(data);
		},
	}),
}));

builder.objectType('PublicRecipe', {
	fields: (t) => ({
		id: t.exposeID('id'),
		title: t.exposeString('title'),
		prelude: t.field({
			type: 'JSON',
			resolve: (recipe) => recipe.prelude,
		}),
		mainImageUrl: t.exposeString('mainImageUrl', { nullable: true }),
		ingredients: t.field({
			type: ['PublicRecipeIngredient'],
			resolve: (recipe) =>
				recipe.ingredients.map(assignTypeName('PublicRecipeIngredient')),
		}),
		instructions: t.field({
			type: 'JSON',
			resolve: (recipe) => recipe.instructions,
		}),
		publisher: t.field({
			type: 'PublicRecipePublisher',
			resolve: (recipe) => recipe.publisher,
		}),
		note: t.exposeString('note', { nullable: true }),
		servings: t.exposeInt('servings', { nullable: true }),
		prepTimeMinutes: t.exposeInt('prepTimeMinutes', { nullable: true }),
		cookTimeMinutes: t.exposeInt('cookTimeMinutes', { nullable: true }),
		totalTimeMinutes: t.exposeInt('totalTimeMinutes', { nullable: true }),

		embeddedRecipes: t.field({
			type: ['PublicRecipe'],
			resolve: async (recipe, _, ctx) => {
				const embeddedIds = getEmbeddedRecipeIds(recipe);
				if (embeddedIds.length === 0) {
					return [];
				}
				const library = await ctx.reqCtx.env.VERDANT_LIBRARY.getByName(
					getLibraryName({
						planId: recipe.publisher.planId,
						app: 'gnocchi',
						access: 'members',
						userId: recipe.publisher.id,
					}),
				);
				const embeddedRecipes = await Promise.all(
					embeddedIds.map((id) =>
						loadRecipeData(id, recipe.publisher, library),
					),
				);

				return embeddedRecipes
					.filter((r): r is PublicRecipeData => !!r)
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
		food: t.exposeString('food'),
		id: t.exposeID('id'),
		note: t.exposeString('note', { nullable: true }),
	}),
});

// helpers
function getEmbeddedRecipeIds(snapshot: any) {
	const steps = snapshot?.instructions?.content ?? [];
	const recipeIds = new Set<string>();
	for (const step of steps) {
		if (step?.attrs?.subRecipeId) {
			recipeIds.add(step.attrs.subRecipeId);
		}
	}
	return Array.from(recipeIds);
}

async function loadRecipeData(
	recipeId: string,
	publisher: { planId: string; id: string; fullName: string },
	library: LibraryApi,
): Promise<PublicRecipeData | null> {
	const snapshot = await library.getDocumentSnapshot('recipes', recipeId);

	if (!snapshot) {
		return null;
	}

	return {
		id: recipeId,
		title: snapshot.title,
		prelude: snapshot.prelude,
		mainImageUrl: snapshot.mainImage?.url,
		ingredients: snapshot.ingredients,
		instructions: snapshot.instructions,
		note: snapshot.note,
		prepTimeMinutes: snapshot.prepTimeMinutes,
		cookTimeMinutes: snapshot.cookTimeMinutes,
		totalTimeMinutes: snapshot.totalTimeMinutes,
		servings: snapshot.servings,
		publisher,
	} satisfies PublicRecipeData;
}
