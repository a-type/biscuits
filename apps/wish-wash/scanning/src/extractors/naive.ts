import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';
import { findFirstMatch } from './utils.js';

export async function naive(
	$: CheerioAPI,
	_pageUrl: string,
): Promise<ExtractorData | null> {
	const nameElement = findFirstMatch($, [
		'#name',
		'h1',
		'h2.name',
		'h3.name',
		'.product-name',
		'[class*="name"]',
		'.name',
		'.title',
	]);
	const priceElement = findFirstMatch($, [
		'.price',
		'.product__price',
		'.product-price',
		'.mv-create-price',
		// classes containing price
		'[class*="price"]',
	]);

	const priceRaw = priceElement?.text();
	const price = priceRaw;
	// try to detect currency symbol in raw price string as any non-number/decimal character
	const currency = priceRaw
		?.match(/[^\d.]/g)
		?.join('')
		.trim();

	return {
		scanner: 'naive',
		productName: nameElement?.text().trim(),
		price,
		currency,
	};
}
