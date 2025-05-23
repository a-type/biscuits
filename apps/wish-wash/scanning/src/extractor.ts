import { CheerioAPI } from 'cheerio';

type UnwrapPromise<T extends Promise<any>> =
  T extends Promise<infer U> ? U : never;

import * as extractors from './extractors/index.js';
import { ExtractorData } from './extractors/types.js';

type Extractor = ($: CheerioAPI) => Promise<ExtractorData | null>;

const extractorOrdering: [RegExp, Extractor][] = [
  [/amazon/, extractors.amazon],
  [/etsy/, extractors.etsy],
  [/ebay/, extractors.ebay],
  [/.*/, extractors.microdata],
  [/.*/, extractors.schemaOrg],
  [/.*/, extractors.naive],
];

async function tryParse($: CheerioAPI, pageUrl: string) {
  for (const [filter, extractor] of extractorOrdering) {
    if (!filter.test(pageUrl)) {
      continue;
    }
    const result = await extractor($);
    if (result) {
      return result;
    }
  }
}

export async function extract($: CheerioAPI, pageUrl: string) {
  const result = await tryParse($, pageUrl);
  return {
    scanner: 'none',
    ...result,
    url: result?.url || pageUrl,
  };
}

export type ScanResult = UnwrapPromise<ReturnType<typeof extract>>;
