import { BiscuitsError } from '@biscuits/error';
import { builder } from '../builder.js';
import { logger } from '../../logger.js';

builder.queryFields((t) => ({
  productInfo: t.field({
    type: 'ProductInfo',
    args: {
      lookupKey: t.arg.string({
        required: true,
      }),
    },
    resolve: (_, { lookupKey }, ctx) => ({
      lookupKey,
    }),
  }),
}));

builder.objectType('ProductInfo', {
  fields: (t) => ({
    id: t.exposeString('lookupKey'),
    price: t.field({
      type: 'Int',
      nullable: true,
      resolve: async (product, _, ctx) => {
        const info = await ctx.dataloaders.stripePriceLookupKeyLoader.load(
          product.lookupKey,
        );
        if (!info) {
          throw new BiscuitsError(
            BiscuitsError.Code.NotFound,
            'Product info not found',
          );
        }
        return info.unit_amount;
      },
    }),
    currency: t.field({
      type: 'String',
      nullable: true,
      resolve: async (product, _, ctx) => {
        const info = await ctx.dataloaders.stripePriceLookupKeyLoader.load(
          product.lookupKey,
        );
        if (!info) {
          throw new BiscuitsError(
            BiscuitsError.Code.NotFound,
            'Product info not found',
          );
        }
        return info.currency;
      },
    }),
    name: t.field({
      type: 'String',
      nullable: true,
      resolve: async (product, _, ctx) => {
        const info = await ctx.dataloaders.stripePriceLookupKeyLoader.load(
          product.lookupKey,
        );
        if (!info) {
          throw new BiscuitsError(
            BiscuitsError.Code.NotFound,
            'Product info not found',
          );
        }
        if (typeof info.product === 'string') {
          logger.urgent('Product info not expanded correctly');
          throw new BiscuitsError(BiscuitsError.Code.Unexpected);
        }
        if (info.product.deleted) {
          return 'Legacy plan';
        }
        return info.product.name;
      },
    }),
    description: t.field({
      type: 'String',
      nullable: true,
      resolve: async (product, _, ctx) => {
        const info = await ctx.dataloaders.stripePriceLookupKeyLoader.load(
          product.lookupKey,
        );
        if (!info) {
          throw new BiscuitsError(
            BiscuitsError.Code.NotFound,
            'Product info not found',
          );
        }
        if (typeof info.product === 'string') {
          logger.urgent('Product info not expanded correctly');
          throw new BiscuitsError(BiscuitsError.Code.Unexpected);
        }
        if (info.product.deleted) {
          return 'This plan is no longer available.';
        }
        return info.product.description;
      },
    }),
  }),
});
