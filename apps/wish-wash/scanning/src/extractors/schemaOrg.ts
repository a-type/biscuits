import { CheerioAPI } from 'cheerio';
import { ExtractorData } from './types.js';
import { extractNumber } from './utils.js';

export async function schemaOrg($: CheerioAPI): Promise<ExtractorData | null> {
  let scripts = $('script');
  // find a script that has a Schema.org JSON-LD object for a Recipe
  let s = scripts
    .filter((i, el) => {
      let text = $(el).text();
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
  try {
    let firstOffer = data.offers?.[0];
    let price = firstOffer?.price;
    let currency = firstOffer?.priceCurrency;
    return {
      scanner: 'schemaOrg',
      productName: data.name || data.headline,
      imageUrl: data.image?.url,
      price,
      currency,
    };
  } catch (e) {
    return null;
  }
}
