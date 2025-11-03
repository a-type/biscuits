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
    type: schema.fields.string({
      options: ["shopping", "wishlist", "ideas"],
      default: "shopping"
    }),
    completedQuestions: schema.fields.array({
      items: schema.fields.string(),
      documentation: "IDs of onboarding questions that have been completed"
    }),
    linkedPublicListSlug: schema.fields.string({
      nullable: true
    }),
    webWishlistLinks: schema.fields.array({
      items: schema.fields.string()
    }),
    description: schema.fields.string({
      nullable: true
    }),
    coverImage: schema.fields.file({
      nullable: true
    }),
    items: schema.fields.array({
      items: schema.fields.object({
        properties: {
          id: schema.fields.id(),
          description: schema.fields.string({
            default: ""
          }),
          prompt: schema.fields.string({
            nullable: true,
            documentation: "If this item was created from a survey question, this is the question."
          }),
          lastPurchasedAt: schema.fields.number({
            nullable: true
          }),
          createdAt: schema.fields.number({
            default: Date.now
          }),
          expiresAt: schema.fields.number({
            nullable: true,
            documentation: "If set, the item is considered expired after this timestamp asn the user is prompted as to whether it is still wanted."
          }),
          links: schema.fields.array({
            items: schema.fields.string()
          }),
          imageFiles: schema.fields.array({
            items: schema.fields.file()
          }),
          remoteImageUrl: schema.fields.string({
            nullable: true
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
            options: ["idea", "link", "vibe"],
            default: "idea"
          }),
          priceMin: schema.fields.string({
            nullable: true
          }),
          priceMax: schema.fields.string({
            nullable: true
          }),
          note: schema.fields.string({
            nullable: true
          })
        }
      })
    }),
    confirmedRemotePurchases: schema.fields.array({
      items: schema.fields.string()
    })
  },
  indexes: {
    createdAt: {
      field: "createdAt"
    }
  }
});
var schema_default = schema({
  version: 12,
  collections: {
    lists
  }
});
export {
  schema_default as default
};
