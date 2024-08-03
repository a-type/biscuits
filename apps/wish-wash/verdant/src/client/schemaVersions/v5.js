/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
var lists = schema.collection({
  name: "list",
  primaryKey: "id",
  fields: {
    id: schema.fields.id(),
    name: schema.fields.string({
      default: "New list"
    }),
    createdAt: schema.fields.number({
      default: Date.now
    }),
    items: schema.fields.array({
      items: schema.fields.object({
        properties: {
          id: schema.fields.id(),
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
          expirationNotificationSent: schema.fields.boolean({
            default: false
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
  version: 5,
  collections: {
    lists
  }
});
export {
  schema_default as default
};
