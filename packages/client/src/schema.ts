import { removeStopwords } from 'stopword';

/**
 * Creates a full-text search index for a given string.
 */
export function fullTextIndex(str: string) {
	return removeStopwords(str.split(/\s+/)).map((s) => s.toLowerCase());
}
