/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
import cuid from "cuid";
var items = schema.collection({
  name: "item",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: cuid
    }),
    content: schema.fields.string({
      default: ""
    }),
    done: schema.fields.boolean({
      default: false
    }),
    createdAt: schema.fields.number({
      default: () => Date.now()
    })
  },
  indexes: {
    createdAt: {
      field: "createdAt"
    }
  }
});
var schema_default = schema({
  version: 1,
  collections: {
    items
  }
});
export {
  schema_default as default
};
