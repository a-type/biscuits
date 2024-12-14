import { Cheerio, CheerioAPI } from 'cheerio';

export function extractNumber(
	numberOrString?: number | string,
): number | undefined {
	if (numberOrString === undefined) return undefined;
	if (typeof numberOrString === 'number' && !isNaN(numberOrString)) {
		return numberOrString;
	}
	if (typeof numberOrString === 'string') {
		const parsed = parseInt(numberOrString);
		if (!isNaN(parsed)) {
			return parsed;
		}
	}
	return undefined;
}

export function extractText($element: Cheerio<any> | null) {
	if (!$element) {
		return null;
	}
	return collapseWhitespace($element.text().trim());
}

export function toArray(data: string | string[]): string[] {
	if (!data) {
		return [];
	}
	if (Array.isArray(data)) {
		return data;
	}
	return data.split(/\n/);
}

export function collapseWhitespace(line: string, pattern = /\t|\n/g) {
	return line.trim().replaceAll(pattern, ' ').replaceAll(/\s+/g, ' ');
}

export function getSiteName($: CheerioAPI) {
	const siteName = $('meta[property="og:site_name"]').attr('content');
	if (siteName) {
		return siteName;
	}
	return $('title').text();
}

export function toYield(yieldStr: string) {
	if (!yieldStr) {
		return null;
	}
	return parseInt(yieldStr.toLowerCase().replace('servings', ''));
}

export function findFirstMatch($: CheerioAPI, selectors: string[]) {
	for (var i = 0; i < selectors.length; i++) {
		var el = $(selectors[i]);
		if (el.length) {
			return $(el.get(0));
		}
	}
	return null;
}

export function findFirstMatches($: CheerioAPI, selectors: string[]) {
	for (var i = 0; i < selectors.length; i++) {
		var els = $(selectors[i]);
		if (els && els.length) {
			return els;
		}
	}
	return null;
}

export function listToStrings($: CheerioAPI, list: Cheerio<any>) {
	return list
		.toArray()
		.map((el) => $(el).text().trim())
		.map((s) => removeAnyHTMLTags(collapseWhitespace(s)));
}

function removeAnyHTMLTags(text: string) {
	return text.replace(/<\w[^>]*>/gm, '');
}
