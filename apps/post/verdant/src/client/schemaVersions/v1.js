/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
import { createTipTapFieldSchema } from "@verdant-web/tiptap";
var posts = schema.collection({
  name: "post",
  primaryKey: "id",
  fields: {
    id: schema.fields.id(),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    title: schema.fields.string(),
    body: createTipTapFieldSchema({
      default: {
        type: "doc"
      }
    }),
    coverImage: schema.fields.file({
      nullable: true
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
    posts
  }
});
export {
  schema_default as default
};
