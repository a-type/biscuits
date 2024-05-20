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
    id: schema.fields.string({
      default: schema.generated.id,
    }),
    name: schema.fields.string({
      default: 'New list',
    }),
    createdAt: schema.fields.number({
      default: Date.now,
    }),
    items: schema.fields.array({
      items: schema.fields.object({
        properties: {
          id: schema.fields.string({
            default: schema.generated.id,
          }),
          description: schema.fields.string({
            default: '',
          }),
          purchasedAt: schema.fields.number({
            nullable: true,
          }),
          createdAt: schema.fields.number({
            default: Date.now,
          }),
          link: schema.fields.string({
            nullable: true,
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
  version: 1,
  collections: {
    lists,
  },
});
