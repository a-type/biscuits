import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';
import {
	detailedInstructionsToSimple,
	extractNumber,
	isoToMinutes,
	parseInstructionInternalText,
} from './utils.js';

export async function microdata($: CheerioAPI): Promise<ExtractorData | null> {
	let elems = $('[itemscope][itemtype="http://schema.org/Recipe"]');
	if (elems.length === 0) {
		elems = $('[itemscope][itemtype="https://schema.org/Recipe"]');
	}
	if (elems.length === 0) {
		return null;
	}

	const first = $(elems.get(0)!);
	const names = first.find('[itemprop="name"]');
	const name = names
		.filter((index, element) => {
			return findParentType(element as any) === 'http://schema.org/Recipe';
		})
		.text()
		.trim();
	const author = first.find('[itemprop="author"]').text().trim();
	const copyrightHolder = first
		.find('[itemprop="copyrightHolder"]')
		.text()
		.trim();
	const copyrightYear = first.find('[itemprop="copyrightYear"]').text().trim();
	const description = first.find('[itemprop="description"]').text().trim();
	const image = first.find('[itemprop="image"]').attr('src');
	const _datePublished = first.find('[itemprop="datePublished"]').text().trim();
	const cookTime = first.find('[itemprop="cookTime"]').text().trim();
	const prepTime = first.find('[itemprop="prepTime"]').text().trim();
	const totalTime = first.find('[itemprop="totalTime"]').text().trim();
	const _cookingMethod = first.find('[itemprop="cookingMethod"]').text().trim();
	const _recipeCategory = first
		.find('[itemprop="recipeCategory"]')
		.text()
		.trim();
	const _recipeCuisine = first.find('[itemprop="recipeCuisine"]').text().trim();
	const recipeYield = first.find('[itemprop="recipeYield"]').text().trim();
	const recipeIngredient = first
		.find('[itemprop="recipeIngredient"]')
		.map((i, e) => $(e).text().trim())
		.get();
	const recipeInstructionElements = first
		.find('[itemprop="recipeInstructions"]')
		.get();
	const recipeInstructionsDetailed = recipeInstructionElements
		.map((e) => {
			return parseInstructionInternalText($, $(e));
		})
		.flat();
	const note = first.find('[itemprop="note"]').text().trim();

	return {
		scanner: 'microdata',
		title: name,
		description,
		image,
		copyrightHolder,
		copyrightYear,
		author,
		cookTimeMinutes: isoToMinutes(cookTime),
		prepTimeMinutes: isoToMinutes(prepTime),
		totalTimeMinutes: isoToMinutes(totalTime),
		rawIngredients: recipeIngredient,
		steps: detailedInstructionsToSimple(recipeInstructionsDetailed),
		detailedSteps: recipeInstructionsDetailed,
		servings: extractNumber(recipeYield),
		note,
	};
}

function getItemScope(element: any): any | null {
	if (!element || !('attribs' in element)) {
		return null;
	}
	if (element.attribs.itemscope !== undefined) {
		return element;
	}
	if (element.parent) {
		return getItemScope(element.parent);
	}
	return null;
}

function findParentType(element: any) {
	const itemScope = getItemScope(element);
	if (!itemScope) {
		return null;
	}
	return getSchemaType(itemScope);
}

function getSchemaType(element: any): string | null {
	return element.attribs.itemtype || null;
}
