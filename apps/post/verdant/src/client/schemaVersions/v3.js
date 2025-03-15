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
    summary: schema.fields.string({
      nullable: true
    }),
    coverImage: schema.fields.file({
      nullable: true
    }),
    notebookId: schema.fields.string({
      nullable: true,
      documentation: "The ID of the notebook this post belongs to, if any. If null, the post is not in a notebook."
    })
  },
  indexes: {
    createdAt: {
      field: "createdAt"
    },
    notebookId: {
      field: "notebookId"
    }
  },
  compounds: {
    notebookId_createdAt: {
      of: ["notebookId", "createdAt"]
    }
  }
});
var notebooks = schema.collection({
  name: "notebook",
  primaryKey: "id",
  fields: {
    id: schema.fields.id(),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    name: schema.fields.string(),
    coverImage: schema.fields.file({
      nullable: true
    }),
    icon: schema.fields.file({
      nullable: true
    }),
    description: createTipTapFieldSchema({
      default: {
        type: "doc"
      }
    }),
    theme: schema.fields.string({
      nullable: true
    }),
    font: schema.fields.string({
      nullable: true
    })
  },
  indexes: {
    name: {
      field: "name"
    }
  }
});
var schema_default = schema({
  version: 3,
  collections: {
    posts,
    notebooks
  }
});
export {
  schema_default as default
};
