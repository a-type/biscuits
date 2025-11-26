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
    value: schema.fields.number({
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
  }
});
var tags = schema.collection({
  name: "tag",
  primaryKey: "value",
  fields: {
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
    useCount: {
      field: "useCount"
    },
    lastUsedAt: {
      field: "lastUsedAt"
    }
  }
});
var schema_default = schema({
  version: 1,
  collections: {
    entries,
    tags
  }
});
export {
  schema_default as default
};
