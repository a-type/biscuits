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
    createdBy: schema.fields.string({
      nullable: true
    }),
    tags: schema.fields.array({
      items: schema.fields.string()
    })
  },
  indexes: {
    createdAt: {
      field: "createdAt"
    },
    matchText: {
      type: "string[]",
      compute: (person) => person.name.toLowerCase().split(/\s+/).concat(person.note?.toLowerCase().split(/\s+/) ?? [])
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
    },
    tags: {
      type: "string[]",
      compute: (person) => person.tags
    }
  },
  compounds: {
    tag_createdAt: {
      of: ["tags", "createdAt"]
    }
  }
});
var relationships = schema.collection({
  name: "relationship",
  primaryKey: "id",
  fields: {
    id: schema.fields.id(),
    personAId: schema.fields.string(),
    personALabel: schema.fields.string({ nullable: true }),
    personBId: schema.fields.string(),
    personBLabel: schema.fields.string({ nullable: true })
  },
  indexes: {
    personId: {
      type: "string[]",
      compute: (relationship) => [
        relationship.personAId,
        relationship.personBId
      ]
    }
  }
});
var tags = schema.collection({
  name: "tag",
  primaryKey: "name",
  fields: {
    name: schema.fields.string(),
    color: schema.fields.string({ nullable: true }),
    icon: schema.fields.string({ nullable: true })
  }
});
var schema_default = schema({
  version: 2,
  collections: {
    people,
    relationships,
    tags
  }
});
export {
  schema_default as default
};
