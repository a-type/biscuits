import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';

export async function etsy($: CheerioAPI): Promise<ExtractorData> {
  let productName = $('[data-buy-box-listing-title="true"]').text().trim();
  let price = $('[data-selector="price-only"]').first().text().trim();
  let priceNumber = price.match(/\d+\.\d+/g);
  let priceValue = priceNumber ? priceNumber[0] : undefined;
  let priceSymbol = price
    .match(/[^\d\.]/g)
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
