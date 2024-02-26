import DataLoader from 'dataloader';
import Stripe from 'stripe';
import { DB } from '@biscuits/db';

const priceMemoryCache = new Map<string, Stripe.Price>();

export function createDataloaders({ stripe, db }: { stripe: Stripe; db: DB }) {
  const stripePriceLoader = new DataLoader(async (ids: readonly string[]) => {
    // hit the memory cache first
    const result: (Stripe.Price | null)[] = ids.map(
      (id) => priceMemoryCache.get(id) ?? null,
    );
    if (result.every((price) => price !== null)) {
      return result as Stripe.Price[];
    }

    const prices = await stripe.prices.list({
      expand: ['data.product'],
    });
    const idToIndex = Object.fromEntries(ids.map((id, index) => [id, index]));
    for (const price of prices.data) {
      const index = idToIndex[price.id];
      result[index] = price;
    }
    return result;
  });

  return {
    stripePriceLoader,
  };
}
