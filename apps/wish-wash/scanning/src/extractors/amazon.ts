import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';
import * as fs from 'fs';
import { findFirstMatch } from './utils.js';

export async function amazon($: CheerioAPI): Promise<ExtractorData> {
  let productName = $('#productTitle').text().trim();
  let priceValue: string | undefined = undefined;
  let priceSymbol: string | undefined = undefined;

  let priceArea = findFirstMatch($, [
    '[data-feature=name="corePrice"]',
    '[data-feature-name="corePriceDisplay_desktop"]',
    '[id*=corePrice]',
  ]);
  if (priceArea) {
    let price = priceArea.find('.a-price').first();
    priceSymbol = price.find('.a-price-symbol').text().trim();
    let priceFraction = price.find('.a-price-fraction').text().trim();
    let priceWhole = price.find('.a-price-whole').text().trim();
    priceValue = priceWhole ? `${priceWhole}${priceFraction ?? 0}` : undefined;
  }

  let image = $('#landingImage');

  const priceSlotResult = getPriceSlots($);

  if (!priceValue) {
    priceValue = priceSlotResult.price;
  }

  if (!priceValue) {
    fs.writeFileSync('amazon-failed.html', $.html());
  }

  return {
    scanner: 'amazon',
    productName: productName || undefined,
    price: priceValue || undefined,
    currency: priceSymbol || '$',
    priceIsVariable: priceSlotResult.priceIsVariable,
    imageUrl: image.attr('src') || undefined,
  };
}

function getPriceSlots($: CheerioAPI): {
  price: string;
  priceIsVariable: boolean;
} {
  // collect all .slot-price elements
  const priceSlots = $('.slot-price');
  // parse as either a single price or a range
  if (priceSlots.length === 1) {
    return { price: priceSlots.text(), priceIsVariable: false };
  } else {
    const result = { price: '', priceIsVariable: true };
    for (const slot of priceSlots) {
      // split on -
      const parts = $(slot).text().split(' - ');
      // extract numbers
      const numbers = parts.map((p) => p.match(/\d+(\.\d+)?/));
      // parse numbers
      const parsed = numbers.map((n) => (n ? parseFloat(n[0]) : NaN));
      // assign min
      const minParsed = Math.min(...parsed);
      if (!isNaN(minParsed) && minParsed < parseFloat(result.price)) {
        result.price = minParsed.toString();
      }
    }
    return result;
  }
}
