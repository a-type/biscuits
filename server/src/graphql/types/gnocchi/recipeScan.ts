import { scanWebRecipe } from '@gnocchi.biscuits/scanning';
import { builder } from '../../builder.js';

builder.queryFields((t) => ({
	recipeScan: t.field({
		type: 'RecipeScanResult',
		nullable: true,
		args: {
			input: t.arg({
				type: 'RecipeScanInput',
				required: true,
			}),
		},
		authScopes: {
			freeLimited: ['gnocchi_recipe_scan', 5, 'month'],
		},
		resolve: async (_, { input }, ctx) => {
			const result = await scanWebRecipe(input.url);
			if (!result) return null;
			return {
				type: 'web' as const,
				data: result,
			};
		},
	}),
}));

builder.objectType('RecipeScan', {
	fields: (t) => ({
		title: t.exposeString('title', {
			nullable: true,
		}),
		description: t.exposeString('description', {
			nullable: true,
		}),
		imageUrl: t.exposeString('image', {
			nullable: true,
		}),
		author: t.exposeString('author', {
			nullable: true,
		}),
		copyrightHolder: t.exposeString('copyrightHolder', {
			nullable: true,
		}),
		copyrightYear: t.exposeString('copyrightYear', {
			nullable: true,
		}),
		url: t.exposeString('url', {
			nullable: true,
		}),
		rawIngredients: t.exposeStringList('rawIngredients', {
			nullable: true,
		}),
		steps: t.exposeStringList('steps', {
			nullable: true,
		}),
		detailedIngredients: t.expose('detailedIngredients', {
			type: ['RecipeScanDetailedIngredient'],
			nullable: true,
		}),
		detailedSteps: t.expose('detailedSteps', {
			type: ['RecipeScanDetailedStep'],
			nullable: true,
		}),
		cookTimeMinutes: t.exposeInt('cookTimeMinutes', {
			nullable: true,
		}),
		prepTimeMinutes: t.exposeInt('prepTimeMinutes', {
			nullable: true,
		}),
		totalTimeMinutes: t.exposeInt('totalTimeMinutes', {
			nullable: true,
		}),
		servings: t.exposeInt('servings', {
			nullable: true,
		}),
		note: t.exposeString('note', {
			nullable: true,
		}),
	}),
});

builder.objectType('RecipeScanResult', {
	fields: (t) => ({
		type: t.exposeString('type'),
		data: t.expose('data', {
			type: 'RecipeScan',
		}),
	}),
});

builder.objectType('RecipeScanDetailedIngredient', {
	fields: (t) => ({
		original: t.exposeString('original'),
		quantity: t.exposeFloat('quantity'),
		unit: t.exposeString('unit', {
			nullable: true,
		}),
		foodName: t.exposeString('foodName'),
		comments: t.exposeStringList('comments', {
			nullable: true,
		}),
		preparations: t.exposeStringList('preparations', {
			nullable: true,
		}),
		note: t.exposeString('note', {
			nullable: true,
		}),
		isSectionHeader: t.exposeBoolean('isSectionHeader', {
			nullable: true,
		}),
	}),
});

builder.objectType('RecipeScanDetailedStep', {
	fields: (t) => ({
		type: t.exposeString('type'),
		content: t.exposeString('content'),
		note: t.exposeString('note', {
			nullable: true,
		}),
	}),
});

builder.inputType('RecipeScanInput', {
	fields: (t) => ({
		url: t.string({
			required: true,
		}),
	}),
});
