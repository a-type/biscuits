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
    })
  },
  indexes: {
    createdAt: {
      field: "createdAt"
    },
    matchText: {
      type: "string[]",
      compute: (person) => person.name.split(/s/).concat(person.note?.split(/s/) ?? [])
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
