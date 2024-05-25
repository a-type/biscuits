import DataLoader from 'dataloader';
import Stripe from 'stripe';
import { DB } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';

const priceLookupKeyCache = new Map<string, Stripe.Price>();
const priceIdCache = new Map<string, Stripe.Price>();

export function keyIndexes(ids: readonly string[]) {
  return Object.fromEntries(ids.map((id, index) => [id, index]));
}

export function createResults<T>(ids: readonly string[], defaultValue?: T) {
  return new Array<T | Error>(ids.length).fill(
    defaultValue ?? new BiscuitsError(BiscuitsError.Code.NotFound),
  );
}

export function createDataloaders({ stripe, db }: { stripe: Stripe; db: DB }) {
  const stripePriceLookupKeyLoader = new DataLoader(
    async (lookupKeys: readonly string[]) => {
      // hit the memory cache first
      const result: (Stripe.Price | null)[] = lookupKeys.map(
        (lookupKey) => priceLookupKeyCache.get(lookupKey) ?? null,
      );
      if (result.every((price) => price !== null)) {
        return result as Stripe.Price[];
      }

      const prices = await stripe.prices.list({
        expand: ['data.product'],
      });
      const keyToIndex = Object.fromEntries(
        lookupKeys.map((lookupKey, index) => [lookupKey, index]),
      );
      for (const price of prices.data) {
        if (!price.lookup_key) continue;

        const index = keyToIndex[price.lookup_key];
        result[index] = price;
        priceLookupKeyCache.set(price.lookup_key, price);
        priceIdCache.set(price.id, price);
      }
      return result;
    },
  );

  const stripePriceIdLoader = new DataLoader(async (ids: readonly string[]) => {
    const result: (Stripe.Price | null)[] = ids.map(
      (id) => priceIdCache.get(id) ?? null,
    );
    if (result.every((price) => price !== null)) {
      return result as Stripe.Price[];
    }

    const prices = await stripe.prices.list({
      expand: ['data.product'],
    });
    const idToIndex = keyIndexes(ids);
    for (const price of prices.data) {
      const index = idToIndex[price.id];
      result[index] = price;
      priceIdCache.set(price.id, price);
      if (price.lookup_key) priceLookupKeyCache.set(price.lookup_key, price);
    }
    return result;
  });

  return {
    stripePriceLookupKeyLoader,
    stripePriceIdLoader,
  };
}
