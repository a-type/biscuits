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
      default: Date.now()
    }),
    items: schema.fields.array({
      items: schema.fields.object({
        properties: {
          id: schema.fields.string({
            default: schema.generated.id
          }),
          description: schema.fields.string({
            default: ""
          }),
          purchasedAt: schema.fields.number({
            nullable: true
          }),
          createdAt: schema.fields.number({
            default: Date.now()
          }),
          link: schema.fields.string({
            nullable: true
          })
        }
      })
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
    lists
  }
});
export {
  schema_default as default
};
