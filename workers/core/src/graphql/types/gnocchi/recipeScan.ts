import {
	BrowserRunBinding,
	scanWebRecipe,
	scanWebRecipeWithBrowser,
} from '@gnocchi.biscuits/scanning';
import { builder } from '../../builder.js';

async function scanRecipeWithFallback(url: string, browser: BrowserRunBinding) {
	let result;
	let fallbackReason: 'no-result' | 'html-scan-error';
	try {
		result = await scanWebRecipe(url);
		if (result?.scanner !== 'none') return result;
		fallbackReason = 'no-result';
	} catch (error) {
		fallbackReason = 'html-scan-error';
		console.warn('Recipe browser scrape fallback triggered', {
			url,
			reason: fallbackReason,
			error,
		});
	}

	if (fallbackReason === 'no-result') {
		console.info('Recipe browser scrape fallback triggered', {
			url,
			reason: fallbackReason,
		});
	}

	try {
		const browserResult = await scanWebRecipeWithBrowser(browser, url);
		console.info('Recipe browser scrape fallback completed', {
			url,
			reason: fallbackReason,
			success: browserResult !== null,
			scanner: browserResult?.scanner,
		});
		return browserResult ?? result;
	} catch (error) {
		console.error('Recipe browser scrape fallback failed', { url, error });
		return result;
	}
}

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
		authScopes: (_, { input }, ctx) => {
			// allow unlimited free access to recipe scanning for
			// our own recipes
			if (input.publicRecipeSlug && !input.url) {
				return {
					public: true,
				};
			}
			return {
				freeLimited: ['gnocchi_recipe_scan', 5, 'month'],
			};
		},
		resolve: async (_, { input }, ctx) => {
			if (input.url) {
				const result = await scanRecipeWithFallback(
					input.url,
					ctx.reqCtx.env.BROWSER,
				);
				if (!result) return null;
				return {
					type: 'web' as const,
					data: result,
				};
			}
			if (input.publicRecipeSlug) {
				const recipe = await ctx.db
					.selectFrom('PublishedRecipe')
					.where('slug', '=', input.publicRecipeSlug)
					.select(['PublishedRecipe.planId', 'PublishedRecipe.slug'])
					.executeTakeFirst();
				if (!recipe) {
					return null;
				}
				const publicUrl = `${ctx.reqCtx.env.GNOCCHI_HUB_ORIGIN}/p/${recipe.planId}/${recipe.slug}`;
				const result = await scanRecipeWithFallback(
					publicUrl,
					ctx.reqCtx.env.BROWSER,
				);
				if (!result) return null;
				return {
					type: 'web' as const,
					data: result,
				};
			}
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
		scanner: t.exposeString('scanner'),
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
		url: t.string(),
		publicRecipeSlug: t.string(),
	}),
});
