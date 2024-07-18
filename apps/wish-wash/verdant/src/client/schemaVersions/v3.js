/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
var lists = schema.collection({
  name: "list",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: schema.generated.id
    }),
    name: schema.fields.string({
      default: "New list"
    }),
    createdAt: schema.fields.number({
      default: Date.now
    })
  },
  indexes: {
    createdAt: {
      field: "createdAt"
    }
  }
});
var items = schema.collection({
  name: "item",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: schema.generated.id
    }),
    listId: schema.fields.string(),
    description: schema.fields.string({
      default: ""
    }),
    purchasedAt: schema.fields.number({
      nullable: true
    }),
    createdAt: schema.fields.number({
      default: Date.now
    }),
    link: schema.fields.string({
      nullable: true
    }),
    expiresAt: schema.fields.number({
      nullable: true
    }),
    imageUrl: schema.fields.string({
      nullable: true
    }),
    imageFile: schema.fields.file({
      nullable: true
    }),
    count: schema.fields.number({
      default: 1
    }),
    prioritized: schema.fields.boolean({
      default: false
    })
  },
  indexes: {
    listId: {
      field: "listId"
    },
    createdAt: {
      field: "createdAt"
    },
    purchasedAt: {
      field: "purchasedAt"
    },
    /**
     * Sorts items by recently created, with prioritized at the top
     * Since all compound index parts are lexographically sorted this
     * exploits that to get prioritized items at the top by prepending
     * a 'z' to the createdAt timestamp
     */
    prioritizedThenCreatedAt: {
      type: "string",
      compute: (item) => {
        if (item.prioritized) {
          return "z" + item.createdAt;
        }
        return item.createdAt.toString();
      }
    }
  },
  compounds: {
    listOrder: {
      of: ["listId", "prioritizedThenCreatedAt"]
    }
  }
});
var schema_default = schema({
  version: 3,
  collections: {
    lists,
    items
  }
});
export {
  schema_default as default
};
