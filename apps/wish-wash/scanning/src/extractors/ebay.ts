import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';

export async function ebay($: CheerioAPI): Promise<ExtractorData | null> {
  let productName = $('[data-test-id="itemTitle"]').text().trim();
  let price = $('[data-test-id="item-price"]').text().trim();
  let image = $('[data-test-id="image-carousel"]').find('img').attr('src');
  let priceNumber = price.match(/\d+\.\d+/g);
  let priceValue = priceNumber ? priceNumber[0] : undefined;
  let priceSymbol = price
    .match(/[^\d\.]/g)
    ?.join('')
    .trim();
  return {
    scanner: 'ebay',
    productName: productName || undefined,
    price: priceValue,
    currency: priceSymbol || undefined,
    priceIsVariable: price?.endsWith('+'),
    imageUrl: image,
  };
}
