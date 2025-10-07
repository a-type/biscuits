import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';

export async function etsy(
	$: CheerioAPI,
	_pageUrl: string,
): Promise<ExtractorData> {
	const productName = $('[data-buy-box-listing-title="true"]').text().trim();
	const price = $('[data-selector="price-only"]').first().text().trim();
	const priceNumber = price.match(/\d+\.\d+/g);
	const priceValue = priceNumber ? priceNumber[0] : undefined;
	const priceSymbol = price
		.match(/[^\d.]/g)
		?.join('')
		.trim();
	return {
		scanner: 'etsy',
		productName: productName || undefined,
		price: priceValue,
		currency: priceSymbol || undefined,
		priceIsVariable: price?.endsWith('+'),
	};
}
