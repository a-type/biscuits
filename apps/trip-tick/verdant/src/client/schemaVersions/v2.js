/** @generated - do not modify this file. */

// src/schema.ts
import { collection, schema } from "@verdant-web/store";
import cuid from "cuid";
var lists = collection({
  name: "list",
  primaryKey: "id",
  fields: {
    id: {
      type: "string",
      default: cuid
    },
    createdAt: {
      type: "number",
      default: () => Date.now(),
      indexed: true
    },
    name: {
      type: "string",
      default: "New List"
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            default: cuid
          },
          description: {
            type: "string",
            default: ""
          },
          quantity: {
            type: "number",
            default: 1
          },
          perDays: {
            type: "number",
            default: 0
          },
          additional: {
            type: "number",
            default: 0
          },
          roundDown: {
            type: "boolean",
            default: false
          }
        }
      }
    }
  }
});
var trips = collection({
  name: "trip",
  primaryKey: "id",
  fields: {
    id: {
      type: "string",
      default: cuid
    },
    createdAt: {
      type: "number",
      default: () => Date.now(),
      indexed: true
    },
    lists: {
      type: "array",
      items: {
        type: "string"
      }
    },
    name: {
      type: "string",
      default: "New Trip"
    },
    completions: {
      type: "map",
      values: {
        type: "number"
      }
    },
    startsAt: {
      type: "number",
      nullable: true
    },
    endsAt: {
      type: "number",
      nullable: true
    }
  }
});
var schema_default = schema({
  version: 2,
  collections: {
    lists,
    trips
  }
});
export {
  schema_default as default
};
