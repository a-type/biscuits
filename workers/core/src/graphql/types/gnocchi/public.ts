import { builder } from '../../builder.js';
import { assignTypeName } from '../../relay.js';

builder.queryFields((t) => ({
	publicRecipe: t.field({
		type: 'PublishedRecipe',
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
				.selectAll()
				.where('slug', '=', recipeSlug)
				.where('PublishedRecipe.planId', '=', planId)
				.executeTakeFirst();

			if (!recipe) {
				return null;
			}

			if (!recipe.data || !Object.keys(recipe.data).length) {
				return null;
			}

			return assignTypeName('PublishedRecipe')(recipe);
		},
	}),
	publicRecipePublication: t.field({
		type: 'RecipePublication',
		authScopes: {
			public: true,
		},
		nullable: true,
		args: {
			planId: t.arg.id({
				required: true,
			}),
		},
		resolve: async (_, { planId }, ctx) => {
			const publication = await ctx.db
				.selectFrom('RecipePublication')
				.selectAll()
				.where('planId', '=', planId)
				.executeTakeFirst();

			if (!publication) {
				return null;
			}

			return assignTypeName('RecipePublication')(publication);
		},
	}),
}));

builder.objectType('RecipePublication', {
	fields: (t) => ({
		id: t.exposeID('planId'),
		publicationName: t.exposeString('publicationName', { nullable: true }),
		publishedAt: t.field({
			type: 'DateTime',
			nullable: true,
			resolve: (publication) => publication.publishedAt,
		}),
		description: t.expose('description', {
			type: 'JSON',
			nullable: true,
		}),
		url: t.field({
			type: 'String',
			resolve: async (publication, _, ctx) => {
				const route = await ctx.db
					.selectFrom('DomainRoute')
					.select(['DomainRoute.domain', 'DomainRoute.dnsVerifiedAt'])
					.where('resourceId', '=', publication.id)
					.where('appId', '=', 'gnocchi')
					.executeTakeFirst();

				if (route && route.dnsVerifiedAt) {
					return `https://${route.domain}`;
				}

				return `https://recipes.gnocchi.biscuits.app/p/${publication.planId}`;
			},
		}),

		recipesConnection: t.connection({
			type: 'PublishedRecipe',
			resolve: async (publication, args, ctx) => {
				if (args.before || args.last) {
					throw new Error('Backward pagination is not supported.');
				}

				const limit = args.first ?? 20;

				const query = ctx.db
					.selectFrom('PublishedRecipe')
					.selectAll()
					.where('planId', '=', publication.planId)
					.orderBy('createdAt', 'desc')
					.limit(limit + 1);

				if (args.after) {
					const afterDate = Buffer.from(args.after, 'base64').toString('utf-8');
					query.where('createdAt', '>', afterDate);
				}

				const recipes = await query.execute();

				const edges = recipes.slice(0, limit).map((recipe) => ({
					cursor: Buffer.from(recipe.createdAt.toString()).toString('base64'),
					node: assignTypeName('PublishedRecipe')(recipe),
				}));

				const hasNextPage = recipes.length > limit;

				return {
					edges,
					pageInfo: {
						hasPreviousPage: false,
						hasNextPage,
						endCursor: edges.length ? edges[edges.length - 1].cursor : null,
					},
				};
			},
		}),
	}),
});
