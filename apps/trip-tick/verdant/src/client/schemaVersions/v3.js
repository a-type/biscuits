/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
import cuid from "cuid";
var lists = schema.collection({
  name: "list",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: cuid
    }),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    name: schema.fields.string({
      default: "New List"
    }),
    items: schema.fields.array({
      items: schema.fields.object({
        properties: {
          id: schema.fields.string({
            default: cuid
          }),
          description: schema.fields.string({
            default: ""
          }),
          quantity: schema.fields.number({
            default: 1
          }),
          perDays: schema.fields.number({
            default: 0
          }),
          additional: schema.fields.number({
            default: 0
          }),
          roundDown: schema.fields.boolean({
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
var trips = schema.collection({
  name: "trip",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: cuid
    }),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    lists: schema.fields.array({
      items: schema.fields.string()
    }),
    name: schema.fields.string({
      default: "New Trip"
    }),
    completions: schema.fields.map({
      values: schema.fields.number()
    }),
    startsAt: schema.fields.number({
      nullable: true
    }),
    endsAt: schema.fields.number({
      nullable: true
    }),
    location: schema.fields.object({
      nullable: true,
      properties: {
        name: schema.fields.string(),
        latitude: schema.fields.number(),
        longitude: schema.fields.number()
      }
    })
  },
  indexes: {
    createdAt: {
      field: "createdAt"
    }
  }
});
var schema_default = schema({
  version: 3,
  collections: {
    lists,
    trips
  }
});
export {
  schema_default as default
};
