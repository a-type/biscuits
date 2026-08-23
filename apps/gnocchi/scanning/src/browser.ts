import { load } from 'cheerio';
import { ExtractorData } from './extractors/types.js';
import {
	detailedInstructionsToSimple,
	extractNumber,
	isoToMinutes,
	parseInstructionInternalText,
} from './extractors/utils.js';

interface ScrapedElement {
	text: string;
	html: string;
	attributes: { name: string; value: string }[];
}

interface ScrapeResult {
	selector: string;
	results: ScrapedElement[];
}

interface ScrapeResponse {
	success: boolean;
	result: ScrapeResult[];
	errors?: { code: number; message: string }[];
}

export interface BrowserRunBinding {
	quickAction(
		action: 'scrape',
		options: {
			url: string;
			elements: { selector: string }[];
			gotoOptions?: { waitUntil: 'networkidle0' | 'networkidle2' };
		},
	): Promise<Response>;
}

const recipeSelector =
	':is([itemscope][itemtype="http://schema.org/Recipe"], [itemscope][itemtype="https://schema.org/Recipe"])';

const selectors = {
	title: `${recipeSelector} [itemprop="name"]`,
	author: `${recipeSelector} [itemprop="author"]`,
	copyrightHolder: `${recipeSelector} [itemprop="copyrightHolder"]`,
	copyrightYear: `${recipeSelector} [itemprop="copyrightYear"]`,
	description: `${recipeSelector} [itemprop="description"]`,
	image: `${recipeSelector} [itemprop="image"]`,
	cookTime: `${recipeSelector} [itemprop="cookTime"]`,
	prepTime: `${recipeSelector} [itemprop="prepTime"]`,
	totalTime: `${recipeSelector} [itemprop="totalTime"]`,
	recipeYield: `${recipeSelector} [itemprop="recipeYield"]`,
	recipeIngredient: `${recipeSelector} [itemprop="recipeIngredient"]`,
	recipeInstructions: `${recipeSelector} [itemprop="recipeInstructions"]`,
	note: `${recipeSelector} [itemprop="note"]`,
};

export async function scanWebRecipeWithBrowser(
	browser: BrowserRunBinding,
	url: string,
): Promise<ExtractorData | null> {
	const response = await browser.quickAction('scrape', {
		url,
		elements: Object.values(selectors).map((selector) => ({ selector })),
		gotoOptions: { waitUntil: 'networkidle2' },
	});
	if (!response.ok) {
		throw new Error(
			`Browser Run scrape failed: ${response.status} ${response.statusText}`,
		);
	}

	const payload = (await response.json()) as ScrapeResponse;
	if (!payload.success) {
		throw new Error(
			`Browser Run scrape failed: ${payload.errors?.map((error) => error.message).join(', ') || 'unknown error'}`,
		);
	}

	const groups = payload.result;
	const results = new Map(
		groups.map((group) => [group.selector, group.results]),
	);
	const getAll = (selector: string) => results.get(selector) ?? [];
	const getText = (selector: string) => getAll(selector)[0]?.text.trim() ?? '';
	const title = getText(selectors.title);
	if (!title) return null;

	const detailedSteps = getAll(selectors.recipeInstructions).flatMap(
		(element) => {
			const $ = load(`<div>${element.html}</div>`);
			return parseInstructionInternalText($, $('div').first());
		},
	);
	const imageElement = getAll(selectors.image)[0];
	const image = imageElement?.attributes.find(
		(attribute) => attribute.name === 'src',
	)?.value;

	return {
		scanner: 'browser-microdata',
		title,
		description: getText(selectors.description),
		image,
		copyrightHolder: getText(selectors.copyrightHolder),
		copyrightYear: getText(selectors.copyrightYear),
		author: getText(selectors.author),
		cookTimeMinutes: isoToMinutes(getText(selectors.cookTime)),
		prepTimeMinutes: isoToMinutes(getText(selectors.prepTime)),
		totalTimeMinutes: isoToMinutes(getText(selectors.totalTime)),
		rawIngredients: getAll(selectors.recipeIngredient).map((item) =>
			item.text.trim(),
		),
		steps: detailedInstructionsToSimple(detailedSteps),
		detailedSteps,
		servings: extractNumber(getText(selectors.recipeYield)),
		note: getText(selectors.note),
		url,
	};
}
