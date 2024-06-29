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
    }
  }
});
var schema_default = schema({
  version: 2,
  collections: {
    lists,
    items
  }
});
export {
  schema_default as default
};
