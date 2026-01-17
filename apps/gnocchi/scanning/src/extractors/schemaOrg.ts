import { CheerioAPI } from 'cheerio';
import { DetailedStep, ExtractorData } from './types.js';
import { isoToMinutes, toYield } from './utils.js';

export async function schemaOrg($: CheerioAPI): Promise<ExtractorData | null> {
	const scripts = $('script');
	// find a script that has a Schema.org JSON-LD object for a Recipe
	const s = scripts
		.filter((i, el) => {
			const text = $(el).text();
			try {
				let parsed = JSON.parse(text);
				if (Array.isArray(parsed)) {
					parsed = parsed[0];
				}
				return (
					parsed['@type'] === 'Recipe' || parsed['@type'].includes('Recipe')
				);
			} catch {
				return false;
			}
		})
		.get(0);
	if (!s) return null;
	let data = JSON.parse($(s).text());
	if (Array.isArray(data)) data = data[0];
	try {
		const yieldValue =
			data.recipeYield ?
				Array.isArray(data.recipeYield) ?
					data.recipeYield[0]
				:	data.recipeYield
			:	undefined;
		const detailedSteps: DetailedStep[] = (data.recipeInstructions as any[])
			.map((step: any): DetailedStep[] => {
				if (step['@type'] === 'HowToSection' && step.itemListElement) {
					return [
						{
							content: step.name,
							type: 'sectionTitle',
						},
						...step.itemListElement.map((step: any) => ({
							type: 'step',
							content: step.text || step.name,
						})),
					];
				}

				return [
					{
						type: 'step',
						content: step.text || step.name,
					},
				];
			})
			.flat()
			.filter((v) => !!v.content);
		return {
			scanner: 'schemaOrg',
			title: data.name || data.headline,
			author: data.author?.name,
			image: data.image?.url,
			description: data.description,
			prepTimeMinutes: data.prepTime ? isoToMinutes(data.prepTime) : undefined,
			cookTimeMinutes: data.cookTime ? isoToMinutes(data.cookTime) : undefined,
			totalTimeMinutes:
				data.totalTime ? isoToMinutes(data.totalTime) : undefined,
			servings: yieldValue ? toYield(yieldValue) : undefined,
			rawIngredients: data.recipeIngredient.filter(Boolean),
			copyrightHolder: data.copyrightHolder || data.publisher?.name,
			copyrightYear: data.copyrightYear,
			detailedSteps,
			steps: detailedSteps.map((step) => step.content),
		};
	} catch {
		return null;
	}
}
