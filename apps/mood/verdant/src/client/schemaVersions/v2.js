/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
import { getDay, startOfDay } from "date-fns";
var entries = schema.collection({
  name: "entry",
  primaryKey: "id",
  fields: {
    id: schema.fields.id(),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    createdBy: schema.fields.string({
      nullable: true
    }),
    value: schema.fields.number({
      nullable: true
    }),
    tags: schema.fields.array({
      items: schema.fields.string()
    }),
    weather: schema.fields.object({
      nullable: true,
      fields: {
        unit: schema.fields.string({
          options: ["F", "C", "K"]
        }),
        high: schema.fields.number({ nullable: true }),
        low: schema.fields.number({ nullable: true }),
        precipitationMM: schema.fields.number({ nullable: true })
      }
    })
  },
  indexes: {
    createdAt: {
      field: "createdAt"
    },
    date: {
      type: "number",
      compute(value) {
        const date = startOfDay(new Date(value.createdAt));
        return date.getTime();
      }
    },
    weekday: {
      type: "number",
      compute(value) {
        return getDay(new Date(value.createdAt));
      }
    }
  },
  compounds: {
    createdBy_date: {
      of: ["createdBy", "date"]
    }
  }
});
var tagMetadata = schema.collection({
  name: "tagMetadata",
  primaryKey: "id",
  fields: {
    id: schema.fields.id(),
    value: schema.fields.string(),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    lastUsedAt: schema.fields.number({
      default: () => Date.now()
    }),
    useCount: schema.fields.number({
      default: () => 0
    }),
    color: schema.fields.string({
      nullable: true
    })
  },
  indexes: {
    value: {
      field: "value"
    },
    useCount: {
      field: "useCount"
    },
    lastUsedAt: {
      field: "lastUsedAt"
    }
  }
});
var schema_default = schema({
  version: 2,
  collections: {
    entries,
    tagMetadata
  }
});
export {
  schema_default as default
};
