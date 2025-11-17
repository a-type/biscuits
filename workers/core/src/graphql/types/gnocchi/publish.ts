import { appsById } from '@biscuits/apps';
import { userNameSelector } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import { publicRecipeSchema } from '@gnocchi.biscuits/share-schema';
import { getTld } from '../../../services/domainRoutes.js';
import { builder } from '../../builder.js';
import { assignTypeName, hasTypeName } from '../../relay.js';

builder.queryFields((t) => ({
	publishedRecipe: t.field({
		type: 'PublishedRecipe',
		authScopes: {
			app: 'gnocchi',
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
					'You must be a member to view a published recipe',
				);
			}

			const publishedRecipe = await ctx.db
				.selectFrom('PublishedRecipe')
				.selectAll()
				.where('id', '=', id)
				.where('planId', '=', planId)
				.executeTakeFirst();

			if (!publishedRecipe) return null;

			return assignTypeName('PublishedRecipe')(publishedRecipe);
		},
	}),
}));

builder.mutationFields((t) => ({
	publishRecipe: t.field({
		type: 'PublishedRecipe',
		authScopes: {
			app: 'gnocchi',
		},
		args: {
			input: t.arg({
				type: 'PublishRecipeInput',
				required: true,
			}),
		},
		resolve: async (_, { input }, ctx) => {
			const { id, slug } = input;
			const planId = ctx.session?.planId;
			const userId = ctx.session?.userId;
			if (!planId || !userId) {
				throw new BiscuitsError(
					BiscuitsError.Code.Forbidden,
					'You must be a member to publish a recipe',
				);
			}

			// validate incoming data
			const valid = publicRecipeSchema.safeParse(input.data);
			if (!valid.success) {
				throw new BiscuitsError(
					BiscuitsError.Code.BadRequest,
					`Invalid recipe data: ${valid.error.message}`,
				);
			}
			if (valid.data.id !== id) {
				throw new BiscuitsError(
					BiscuitsError.Code.BadRequest,
					`Recipe ID in data does not match input ID. Input ID is ${id}, but data ID is ${valid.data.id}`,
				);
			}

			const recipe = await ctx.db
				.insertInto('PublishedRecipe')
				.values({
					id,
					planId,
					slug,
					publishedAt: new Date(),
					publishedBy: userId,
					data: valid.data,
				})
				.onConflict((oc) =>
					oc.column('id').where('planId', '=', planId).doUpdateSet({
						slug,
						publishedAt: new Date(),
						publishedBy: userId,
						data: valid.data,
					}),
				)
				.returningAll()
				.executeTakeFirstOrThrow();

			return assignTypeName('PublishedRecipe')(recipe);
		},
	}),

	unpublishRecipe: t.field({
		type: 'ID',
		authScopes: {
			member: true,
		},
		args: {
			recipeId: t.arg.id({
				required: true,
			}),
		},
		resolve: async (_, { recipeId }, ctx) => {
			const planId = ctx.session?.planId;
			if (!planId) {
				throw new BiscuitsError(
					BiscuitsError.Code.Forbidden,
					'You must be a member to unpublish a recipe',
				);
			}

			await ctx.db
				.deleteFrom('PublishedRecipe')
				.where('id', '=', recipeId)
				.where('planId', '=', planId)
				.execute();

			return recipeId;
		},
	}),
}));

builder.objectType('PublishedRecipe', {
	description: 'A published recipe',

	isTypeOf: hasTypeName('PublishedRecipe'),
	fields: (t) => ({
		id: t.exposeID('id'),
		publishedAt: t.expose('publishedAt', {
			type: 'DateTime',
		}),
		url: t.string({
			resolve: (source, _, ctx) => {
				const deployedOrigin = new URL(ctx.reqCtx.env.DEPLOYED_ORIGIN);
				const routed = appsById.gnocchi.domainRoutes!(source.planId, {
					tld: getTld(deployedOrigin.hostname),
				});
				const pubUrl = new URL(routed);
				pubUrl.pathname += `/${source.slug}`;
				return pubUrl.toString();
			},
		}),
		author: t.field({
			type: 'RecipeAuthor',
			resolve: async (recipe, _, ctx) => {
				const user = await ctx.db
					.selectFrom('User')
					.select('User.imageUrl')
					.select(userNameSelector)
					.where('id', '=', recipe.publishedBy)
					.executeTakeFirst();

				return assignTypeName('RecipeAuthor')({
					name: user?.name ?? 'Anonymous',
					profileImageUrl: user?.imageUrl ?? null,
				});
			},
		}),

		publication: t.field({
			type: 'RecipePublication',
			nullable: true,
			resolve: async (recipe, _, ctx) => {
				const publication = await ctx.db
					.selectFrom('RecipePublication')
					.selectAll()
					.where('planId', '=', recipe.planId)
					.executeTakeFirst();

				if (!publication) {
					return null;
				}

				return assignTypeName('RecipePublication')(publication);
			},
		}),

		data: t.field({
			type: 'PublishedRecipeData',
			resolve: (recipe) => assignTypeName('PublishedRecipeData')(recipe.data),
		}),
	}),
});

builder.objectType('PublishedRecipeData', {
	description: 'A published sub-recipe embedded within a published recipe',

	fields: (t) => ({
		id: t.exposeID('id'),
		title: t.exposeString('title'),
		prelude: t.field({
			type: 'JSON',
			resolve: (recipe) => recipe.prelude,
		}),
		mainImageUrl: t.exposeString('mainImageUrl', { nullable: true }),
		ingredients: t.field({
			type: ['PublishedRecipeIngredient'],
			resolve: (recipe) =>
				recipe.ingredients.map(assignTypeName('PublishedRecipeIngredient')),
		}),
		instructions: t.field({
			type: 'JSON',
			resolve: (recipe) => recipe.instructions,
		}),
		note: t.exposeString('note', { nullable: true }),
		servings: t.exposeInt('servings', { nullable: true }),
		prepTimeMinutes: t.exposeInt('prepTimeMinutes', { nullable: true }),
		cookTimeMinutes: t.exposeInt('cookTimeMinutes', { nullable: true }),
		totalTimeMinutes: t.exposeInt('totalTimeMinutes', { nullable: true }),
		embeddedRecipes: t.field({
			type: ['PublishedRecipeData'],
			resolve: async (recipe, _, ctx) => {
				return recipe.subRecipes.map(assignTypeName('PublishedRecipeData'));
			},
		}),
	}),
});

builder.objectType('RecipeAuthor', {
	fields: (t) => ({
		name: t.exposeString('name'),
		profileImageUrl: t.exposeString('profileImageUrl', { nullable: true }),
	}),
});

builder.objectType('PublishedRecipeIngredient', {
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

builder.inputType('PublishRecipeInput', {
	fields: (t) => ({
		id: t.id({
			description: 'The ID of the recipe to publish',
			required: true,
		}),
		slug: t.string({
			description: 'The slug for the published recipe',
			required: true,
		}),
		data: t.field({
			type: 'JSON',
			required: true,
		}),
	}),
});
