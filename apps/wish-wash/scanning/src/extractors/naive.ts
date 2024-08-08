import { CheerioAPI } from 'cheerio';
import {
  extractNumber,
  findFirstMatch,
  findFirstMatches,
  toYield,
} from './utils.js';
import { ExtractorData } from './types.js';

export async function naive($: CheerioAPI): Promise<ExtractorData | null> {
  let nameElement = findFirstMatch($, [
    '#name',
    'h1',
    'h2.name',
    'h3.name',
    '.product-name',
    '[class*="name"]',
    '.name',
    '.title',
  ]);
  let priceElement = findFirstMatch($, [
    '.price',
    '.product__price',
    '.product-price',
    '.mv-create-price',
    // classes containing price
    '[class*="price"]',
  ]);

  let priceRaw = priceElement?.text();
  let price = priceRaw;
  // try to detect currency symbol in raw price string as any non-number/decimal character
  let currency = priceRaw
    ?.match(/[^\d\.]/g)
    ?.join('')
    .trim();

  return {
    scanner: 'naive',
    productName: nameElement?.text().trim(),
    price,
    currency,
  };
}
