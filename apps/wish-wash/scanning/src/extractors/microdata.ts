import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';
import { extractNumber } from './utils.js';

export async function microdata($: CheerioAPI): Promise<ExtractorData | null> {
  let elems = $('[itemscope][itemtype="http://schema.org/Product"]');
  if (elems.length === 0) {
    elems = $('[itemscope][itemtype="https://schema.org/Product"]');
  }
  if (elems.length === 0) {
    return null;
  }

  const image = elems.find(' > [itemprop="image"]').attr('src') || undefined;

  const first = $(elems.get(0)!);
  const name = first.find(' > [itemprop="name"]').text().trim();
  const offers = first.find(' > [itemprop="offers"]').first();
  const offerPrice = offers.find(' > [itemprop="price"]').text().trim();
  const offerCurrency = offers
    .find(' > [itemprop="priceCurrency"]')
    .text()
    .trim();

  return {
    scanner: 'microdata',
    productName: name,
    imageUrl: image,
    price: offerPrice,
    currency: offerCurrency,
  };
}
