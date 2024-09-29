/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
var projects = schema.collection({
  name: "project",
  primaryKey: "id",
  fields: {
    id: schema.fields.id(),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    image: schema.fields.file({
      downloadRemote: true
    }),
    colors: schema.fields.array({
      items: schema.fields.object({
        properties: {
          id: schema.fields.id(),
          pixel: schema.fields.object({
            properties: {
              x: schema.fields.number(),
              y: schema.fields.number()
            }
          }),
          percentage: schema.fields.object({
            properties: {
              x: schema.fields.number(),
              y: schema.fields.number()
            }
          }),
          value: schema.fields.object({
            properties: {
              r: schema.fields.number(),
              g: schema.fields.number(),
              b: schema.fields.number()
            }
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
  version: 2,
  collections: {
    projects
  }
});
export {
  schema_default as default
};
