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

const annotations = schema.collection({
  name: 'annotation',
  primaryKey: 'id',
  fields: {
    id: schema.fields.string({
      default: schema.generated.id,
    }),
    content: schema.fields.string({
      default: '',
    }),
    createdAt: schema.fields.number({
      default: () => Date.now(),
    }),
    book: schema.fields.string(),
    start: schema.fields.object({
      properties: {
        chapter: schema.fields.number(),
        verse: schema.fields.number(),
      },
    }),
    end: schema.fields.object({
      properties: {
        chapter: schema.fields.number(),
        verse: schema.fields.number(),
      },
    }),
  },
  indexes: {
    book: {
      field: 'book',
    },
    startsAt: {
      type: 'string',
      compute(doc) {
        return `${doc.start.chapter}:${doc.start.verse}`;
      },
    },
    endsAt: {
      type: 'string',
      compute(doc) {
        return `${doc.end.chapter}:${doc.end.verse}`;
      },
    },
  },
});

export default schema({
  version: 1,
  collections: {
    annotations,
  },
});
