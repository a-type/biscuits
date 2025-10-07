import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';

export async function schemaOrg(
	$: CheerioAPI,
	_pageUrl: string,
): Promise<ExtractorData | null> {
	const scripts = $('script');
	// find a script that has a Schema.org JSON-LD object for a Recipe
	const s = scripts
		.filter((_i, el) => {
			const text = $(el).text();
			try {
				let parsed = JSON.parse(text);
				if (Array.isArray(parsed)) {
					parsed = parsed[0];
				}
				return (
					parsed['@type'] === 'Recipe' || parsed['@type'].includes('Recipe')
				);
			} catch (e) {
				return false;
			}
		})
		.get(0);
	if (!s) return null;
	let data = JSON.parse($(s).text());
	if (Array.isArray(data)) data = data[0];
	const firstOffer = data.offers?.[0];
	const price = firstOffer?.price;
	const currency = firstOffer?.priceCurrency;
	return {
		scanner: 'schemaOrg',
		productName: data.name || data.headline,
		imageUrl: data.image?.url,
		price,
		currency,
	};
}
