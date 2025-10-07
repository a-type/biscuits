import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';

export async function amazon(
	$: CheerioAPI,
	pageUrl: string,
): Promise<ExtractorData> {
	return {
		scanner: 'amazon',
		productName: 'Amazon Product',
		url: pageUrl,
		failedReason: `Bezos won't let us scan Amazon store pages, sorry!`,
	};
}
