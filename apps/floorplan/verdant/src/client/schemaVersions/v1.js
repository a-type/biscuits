/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
var snapPoint = schema.fields.object({
  documentation: "Point is required, snap will override it.",
  fields: {
    x: schema.fields.number(),
    y: schema.fields.number(),
    snap: schema.fields.object({
      nullable: true,
      fields: {
        lineId: schema.fields.string(),
        side: schema.fields.string({
          options: ["start", "end"]
        }),
        offset: schema.fields.number({
          default: 0
        })
      }
    })
  }
});
var floors = schema.collection({
  name: "floor",
  primaryKey: "id",
  fields: {
    id: schema.fields.id(),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    name: schema.fields.string(),
    lines: schema.fields.map({
      documentation: `Lines represent walls. Their start and end points can snap to one another.`,
      values: schema.fields.object({
        fields: {
          id: schema.fields.id(),
          start: snapPoint,
          end: snapPoint
        }
      })
    }),
    shapes: schema.fields.map({
      documentation: `Shapes represent doors, walls, and furniture. They can be attached to lines or free-floating.`,
      values: schema.fields.object({
        fields: {
          id: schema.fields.id(),
          center: snapPoint,
          width: schema.fields.number(),
          height: schema.fields.number(),
          angle: schema.fields.number({
            default: 0
          }),
          type: schema.fields.string({
            options: ["ellipse", "rectangle"],
            default: "rectangle"
          })
        }
      })
    }),
    labels: schema.fields.map({
      documentation: `Labels are used to add lengths, angles, or general notes.`,
      values: schema.fields.object({
        fields: {
          id: schema.fields.id(),
          center: snapPoint,
          content: schema.fields.string()
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
    floors
  }
});
export {
  schema_default as default
};
