/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
var people = schema.collection({
  name: "person",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: schema.generated.id
    }),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    name: schema.fields.string(),
    geolocation: schema.fields.object({
      properties: {
        latitude: schema.fields.number(),
        longitude: schema.fields.number()
      },
      nullable: true
    }),
    note: schema.fields.string({
      nullable: true
    }),
    photo: schema.fields.file({
      nullable: true
    }),
    relationships: schema.fields.array({
      items: schema.fields.object({
        properties: {
          personId: schema.fields.string(),
          type: schema.fields.string()
        }
      })
    })
  },
  indexes: {
    createdAt: {
      field: "createdAt"
    },
    matchText: {
      type: "string[]",
      compute: (person) => person.name.toLowerCase().split(/s/).concat(person.note?.toLowerCase().split(/\s+/) ?? [])
    },
    matchName: {
      type: "string[]",
      compute: (person) => person.name.toLowerCase().split(/\s+/)
    },
    matchNote: {
      type: "string[]",
      compute: (person) => person.note?.toLowerCase().split(/\s+/) ?? []
    },
    latitude: {
      type: "number",
      compute: (person) => person.geolocation?.latitude ?? -1e4
    },
    longitude: {
      type: "number",
      compute: (person) => person.geolocation?.longitude ?? -1e4
    }
  }
});
var schema_default = schema({
  version: 1,
  collections: {
    people
  }
});
export {
  schema_default as default
};