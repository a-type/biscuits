import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';

export async function amazon($: CheerioAPI): Promise<ExtractorData> {
  let productName = $('#productTitle').text().trim();
  let priceArea = $('[data-feature=name="corePrice"]');
  let price = priceArea.find('.a-price').first();
  let priceSymbol = price.find('.a-price-symbol').text().trim();
  let priceFraction = price.find('.a-price-fraction').text().trim();
  let priceWhole = price.find('.a-price-whole').text().trim();
  let priceValue = priceWhole
    ? `${priceWhole}.${priceFraction ?? 0}`
    : undefined;
  return {
    scanner: 'amazon',
    productName: productName || undefined,
    price: priceValue || undefined,
    currency: priceSymbol || undefined,
  };
}
