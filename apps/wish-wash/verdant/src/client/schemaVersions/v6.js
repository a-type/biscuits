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
          lastPurchasedAt: schema.fields.number({
            nullable: true
          }),
          createdAt: schema.fields.number({
            default: Date.now
          }),
          links: schema.fields.array({
            items: schema.fields.string()
          }),
          expiresAt: schema.fields.number({
            nullable: true
          }),
          expirationNotificationSent: schema.fields.boolean({
            default: false
          }),
          imageFiles: schema.fields.array({
            items: schema.fields.file()
          }),
          count: schema.fields.number({
            default: 1
          }),
          purchasedCount: schema.fields.number({
            default: 0
          }),
          prioritized: schema.fields.boolean({
            default: false
          }),
          type: schema.fields.string({
            options: ["idea", "product", "vibe"],
            default: "idea"
          }),
          sortKey: schema.fields.string({
            default: "a0"
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
  version: 6,
  collections: {
    lists
  }
});
export {
  schema_default as default
};
