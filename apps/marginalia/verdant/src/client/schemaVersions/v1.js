/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
var annotations = schema.collection({
  name: "annotation",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: schema.generated.id
    }),
    content: schema.fields.string({
      default: ""
    }),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    book: schema.fields.string(),
    start: schema.fields.object({
      properties: {
        chapter: schema.fields.number(),
        verse: schema.fields.number()
      }
    }),
    end: schema.fields.object({
      properties: {
        chapter: schema.fields.number(),
        verse: schema.fields.number()
      }
    })
  },
  indexes: {
    book: {
      field: "book"
    },
    startsAt: {
      type: "string",
      compute(doc) {
        return `${doc.start.chapter}:${doc.start.verse}`;
      }
    },
    endsAt: {
      type: "string",
      compute(doc) {
        return `${doc.end.chapter}:${doc.end.verse}`;
      }
    }
  }
});
var schema_default = schema({
  version: 1,
  collections: {
    annotations
  }
});
export {
  schema_default as default
};
