import { schema } from '@verdant-web/store';
import cuid from 'cuid';

const lists = schema.collection({
  name: 'list',
  primaryKey: 'id',
  fields: {
    id: schema.fields.string({
      default: cuid,
    }),
    createdAt: schema.fields.number({
      default: () => Date.now(),
    }),
    name: schema.fields.string({
      default: 'New List',
    }),
    items: schema.fields.array({
      items: schema.fields.object({
        properties: {
          id: schema.fields.string({
            default: cuid,
          }),
          description: schema.fields.string({
            default: '',
          }),
          quantity: schema.fields.number({
            default: 1,
          }),
          /**
           * Need to be able to represent:
           * "every trip"
           * "every day"
           * "every night"
           * "every 2 nights"
           * "every rainy day"
           * "every hot day"
           * "every cold day"
           * "every trip with a rainy day"
           * "every trip with a cold day"
           * "every trip with a hot day"
           */
          period: schema.fields.string({
            default: 'trip',
            options: ['trip', 'day', 'night'],
          }),
          conditions: schema.fields.array({
            items: schema.fields.object({
              properties: {
                type: schema.fields.string({
                  options: ['rain', 'hot', 'cold'],
                }),
                params: schema.fields.map({
                  values: schema.fields.any(),
                }),
              },
            }),
          }),
          periodMultiplier: schema.fields.number({
            default: 1,
          }),
          additional: schema.fields.number({
            default: 0,
          }),
          roundDown: schema.fields.boolean({
            default: false,
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

const trips = schema.collection({
  name: 'trip',
  primaryKey: 'id',
  fields: {
    id: schema.fields.string({
      default: cuid,
    }),
    createdAt: schema.fields.number({
      default: () => Date.now(),
    }),
    lists: schema.fields.array({
      items: schema.fields.string(),
    }),
    name: schema.fields.string({
      default: 'New Trip',
    }),
    completions: schema.fields.map({
      values: schema.fields.number(),
    }),
    startsAt: schema.fields.number({
      nullable: true,
    }),
    endsAt: schema.fields.number({
      nullable: true,
    }),
    location: schema.fields.object({
      nullable: true,
      properties: {
        name: schema.fields.string(),
        latitude: schema.fields.number(),
        longitude: schema.fields.number(),
      },
    }),
    // add additional items to lists. this is keyed on
    // list id and contains an array of extra items.
    extraItems: schema.fields.map({
      values: schema.fields.array({
        items: schema.fields.object({
          properties: {
            id: schema.fields.string({
              default: cuid,
            }),
            description: schema.fields.string({
              default: '',
            }),
            quantity: schema.fields.number({
              default: 1,
            }),
          },
        }),
      }),
    }),
  },
  indexes: {
    createdAt: {
      field: 'createdAt',
    },
    startsAt: {
      field: 'startsAt',
    },
  },
});

export default schema({
  version: 6,
  collections: {
    lists,
    trips,
  },
});
