import { describe, it, expect } from 'vitest';
import { load } from 'cheerio';
import { microdata } from './microdata.js';

describe('microdata extractor', () => {
  it('extracts detailed steps', async () => {
    const html = `
      <html>
        <body>
          <div itemscope itemtype="http://schema.org/Product">
            <h1 itemprop="name">Nintendo Switch</h1>
            <img itemprop="image" itemscope itemtype="http://schema.org/ImageObject" src="https://fakesite.com/wp-content/uploads/2019/08/best-chocolate-chip-cookies.jpg" alt="The Best Chocolate Chip Cookies" />
            <div itemprop="offer">
							<span>$</span>
              <span itemprop="price">299.99</span>
							<p itemprop="priceCurrency" aria-hidden="true">USD</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const $ = load(html);
    const data = await microdata($);

    expect(data).not.toBeNull();
    expect(data!.productName).toBe('Nintendo Switch');
    expect(data!.imageUrl).toBe(
      'https://fakesite.com/wp-content/uploads/2019/08/best-chocolate-chip-cookies.jpg',
    );
    expect(data!.price).toBe(299.99);
    expect(data!.currency).toBe('USD');
  });
});
