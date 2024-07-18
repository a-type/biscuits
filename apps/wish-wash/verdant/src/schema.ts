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
  },
  indexes: {
    createdAt: {
      field: 'createdAt',
    },
  },
});

const items = schema.collection({
  name: 'item',
  primaryKey: 'id',
  fields: {
    id: schema.fields.string({
      default: schema.generated.id,
    }),
    listId: schema.fields.string(),
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
    expiresAt: schema.fields.number({
      nullable: true,
    }),
    imageUrl: schema.fields.string({
      nullable: true,
    }),
    imageFile: schema.fields.file({
      nullable: true,
    }),
    count: schema.fields.number({
      default: 1,
    }),
    prioritized: schema.fields.boolean({
      default: false,
    }),
  },
  indexes: {
    listId: {
      field: 'listId',
    },
    createdAt: {
      field: 'createdAt',
    },
    purchasedAt: {
      field: 'purchasedAt',
    },
    /**
     * Sorts items by recently created, with prioritized at the top
     * Since all compound index parts are lexographically sorted this
     * exploits that to get prioritized items at the top by prepending
     * a 'z' to the createdAt timestamp
     */
    prioritizedThenCreatedAt: {
      type: 'string',
      compute: (item) => {
        if (item.prioritized) {
          // kind of an arbitrary way to get it after everything else
          return 'z' + item.createdAt;
        }
        return item.createdAt.toString();
      },
    },
  },
  compounds: {
    listOrder: {
      of: ['listId', 'prioritizedThenCreatedAt'],
    },
  },
});

export default schema({
  version: 3,
  collections: {
    lists,
    items,
  },
});
