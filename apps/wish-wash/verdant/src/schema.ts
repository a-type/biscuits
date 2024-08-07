import { schema } from '@verdant-web/store';

/**
 * Welcome to your Verdant schema!
 *
 * The schema is where you define your data model.
 *
 * Read more at https://verdant.dev/docs/local-storage/schema
 *
 * The code below is provided as an example, but you'll
 * probably want to delete it and replace it with your
 * own schema.
 *
 * The schema is used to generate the client code for Verdant.
 * After you've replaced this example schema, run `pnpm generate -f`
 * in the root directory to bootstrap your client.
 *
 * For subsequent changes to your schema, use just `pnpm generate`.
 */

const lists = schema.collection({
  name: 'list',
  primaryKey: 'id',
  fields: {
    id: schema.fields.id(),
    name: schema.fields.string({
      default: 'New list',
    }),
    createdAt: schema.fields.number({
      default: Date.now,
    }),
    items: schema.fields.array({
      items: schema.fields.object({
        properties: {
          id: schema.fields.id(),
          description: schema.fields.string({
            default: '',
          }),
          lastPurchasedAt: schema.fields.number({
            nullable: true,
          }),
          createdAt: schema.fields.number({
            default: Date.now,
          }),
          links: schema.fields.array({
            items: schema.fields.string(),
          }),
          expiresAt: schema.fields.number({
            nullable: true,
          }),
          expirationNotificationSent: schema.fields.boolean({
            default: false,
          }),
          imageFiles: schema.fields.array({
            items: schema.fields.file(),
          }),
          count: schema.fields.number({
            default: 1,
          }),
          purchasedCount: schema.fields.number({
            default: 0,
          }),
          prioritized: schema.fields.boolean({
            default: false,
          }),
          type: schema.fields.string({
            options: ['idea', 'product', 'vibe'],
            default: 'idea',
          }),
          sortKey: schema.fields.string({
            default: 'a0',
          }),
        },
      }),
    }),
  },
  indexes: {
    createdAt: {
      field: 'createdAt',
    },
  },
});

export default schema({
  version: 6,
  collections: {
    lists,
  },
});
