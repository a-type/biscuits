/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
import {
  createTipTapFieldSchema,
  createTipTapFileMapSchema
} from "@verdant-web/tiptap";
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
    files: createTipTapFileMapSchema(),
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
    publishedTitle: schema.fields.string({
      nullable: true
    }),
    description: createTipTapFieldSchema({
      default: {
        type: "doc"
      }
    }),
    theme: schema.fields.object({
      properties: {
        primaryColor: schema.fields.string({
          default: "blueberry",
          options: ["lemon", "blueberry", "tomato", "leek", "eggplant", "salt"]
        }),
        fontStyle: schema.fields.string({
          default: "sans-serif",
          options: ["serif", "sans-serif"]
        }),
        spacing: schema.fields.string({
          default: "md",
          options: ["sm", "md", "lg"]
        }),
        corners: schema.fields.string({
          options: ["rounded", "square"]
        })
      }
    })
  },
  indexes: {
    name: {
      field: "name"
    }
  }
});
var schema_default = schema({
  version: 7,
  collections: {
    posts,
    notebooks
  }
});
export {
  schema_default as default
};
