import { describe, expect, it, vi } from 'vitest';
import { BrowserRunBinding, scanWebRecipeWithBrowser } from './browser.js';

describe('Browser Run recipe scanner', () => {
	it('maps scraped microdata to extractor data', async () => {
		const quickAction: BrowserRunBinding['quickAction'] = vi.fn(
			async (
				_action: 'scrape',
				options: Parameters<BrowserRunBinding['quickAction']>[1],
			) =>
				Response.json({
					success: true,
					result: options.elements.map(({ selector }) => ({
						selector,
						results: getResults(selector),
					})),
				}),
		);

		const result = await scanWebRecipeWithBrowser(
			{ quickAction },
			'https://example.com/recipe',
		);

		expect(quickAction).toHaveBeenCalledWith(
			'scrape',
			expect.objectContaining({
				url: 'https://example.com/recipe',
				gotoOptions: { waitUntil: 'networkidle2' },
			}),
		);
		expect(result).toMatchObject({
			scanner: 'browser-microdata',
			title: 'Chocolate Cake',
			image: 'https://example.com/cake.jpg',
			rawIngredients: ['2 cups flour'],
			cookTimeMinutes: 45,
			servings: 8,
			steps: ['Mix ingredients', 'Bake until done'],
			detailedSteps: [
				{ type: 'sectionTitle', content: 'Mix ingredients' },
				{ type: 'step', content: 'Bake until done' },
			],
			url: 'https://example.com/recipe',
		});
	});
});

function getResults(selector: string) {
	if (selector.includes('itemprop="name"')) {
		return [{ text: 'Chocolate Cake', html: 'Chocolate Cake', attributes: [] }];
	}
	if (selector.includes('itemprop="image"')) {
		return [
			{
				text: '',
				html: '',
				attributes: [{ name: 'src', value: 'https://example.com/cake.jpg' }],
			},
		];
	}
	if (selector.includes('itemprop="recipeIngredient"')) {
		return [{ text: '2 cups flour', html: '2 cups flour', attributes: [] }];
	}
	if (selector.includes('itemprop="recipeInstructions"')) {
		return [
			{
				text: 'Mix ingredients Bake until done',
				html: '<h2>Mix ingredients</h2><p>Bake until done</p>',
				attributes: [],
			},
		];
	}
	if (selector.includes('itemprop="cookTime"')) {
		return [{ text: 'PT45M', html: 'PT45M', attributes: [] }];
	}
	if (selector.includes('itemprop="recipeYield"')) {
		return [{ text: '8 servings', html: '8 servings', attributes: [] }];
	}
	return [];
}
