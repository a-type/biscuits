/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
var songs = schema.collection({
  name: "song",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: schema.generated.id
    }),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    title: schema.fields.string(),
    lines: schema.fields.array({
      items: schema.fields.object({
        properties: {
          words: schema.fields.array({
            items: schema.fields.object({
              properties: {
                id: schema.fields.string({
                  default: schema.generated.id
                }),
                text: schema.fields.string({
                  default: ""
                }),
                gapStart: schema.fields.number({
                  default: 0
                }),
                gapEnd: schema.fields.number({
                  default: 0
                }),
                chords: schema.fields.array({
                  items: schema.fields.object({
                    properties: {
                      id: schema.fields.string({
                        default: schema.generated.id
                      }),
                      value: schema.fields.string({
                        default: ""
                      }),
                      offset: schema.fields.number({
                        default: 0
                      })
                    }
                  })
                })
              }
            })
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
  version: 1,
  collections: {
    songs
  }
});
export {
  schema_default as default
};
