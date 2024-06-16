import { schema } from '@verdant-web/store';

const songs = schema.collection({
  name: 'song',
  primaryKey: 'id',
  fields: {
    id: schema.fields.string({
      default: schema.generated.id,
    }),
    createdAt: schema.fields.number({
      default: () => Date.now(),
    }),
    title: schema.fields.string(),
    lines: schema.fields.array({
      items: schema.fields.object({
        properties: {
          words: schema.fields.array({
            items: schema.fields.object({
              properties: {
                text: schema.fields.string(),
                gap: schema.fields.number(),
              },
            }),
          }),
          chords: schema.fields.array({
            items: schema.fields.object({
              properties: {
                value: schema.fields.string(),
                gap: schema.fields.number(),
              },
            }),
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
    songs,
  },
});
