import { scanStorePage } from '@wish-wash.biscuits/scanning';
import { builder } from '../../builder.js';

builder.queryFields((t) => ({
  storePageScan: t.field({
    type: 'StorePageScan',
    nullable: true,
    args: {
      input: t.arg({
        type: 'StorePageScanInput',
        required: true,
      }),
    },
    authScopes: {
      app: 'wish-wash',
    },
    resolve: async (_, { input }, ctx) => {
      const result = await scanStorePage(input.url);
      if (!result) return null;
      return {
        __typename: 'StorePageScan' as const,
        ...result,
        url: input.url,
      };
    },
  }),
}));

builder.objectType('StorePageScan', {
  fields: (t) => ({
    productName: t.exposeString('productName', {
      nullable: true,
    }),
    imageUrl: t.exposeString('imageUrl', {
      nullable: true,
    }),
    price: t.exposeString('price', {
      nullable: true,
    }),
    currency: t.exposeString('currency', {
      nullable: true,
    }),
    url: t.exposeString('url', {
      nullable: true,
    }),
    scanner: t.exposeString('scanner', {
      nullable: true,
    }),
  }),
});

builder.inputType('StorePageScanInput', {
  fields: (t) => ({
    url: t.string({
      required: true,
    }),
  }),
});
