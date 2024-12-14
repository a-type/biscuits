/** @generated - do not modify this file. */

// src/schema.ts
import { schema } from "@verdant-web/store";
var projects = schema.collection({
  name: "project",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: schema.generated.id
    }),
    name: schema.fields.string(),
    createdAt: schema.fields.number({
      default: () => Date.now()
    })
  },
  indexes: {
    createdAt: {
      field: "createdAt"
    }
  }
});
var tasks = schema.collection({
  name: "task",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: schema.generated.id
    }),
    projectId: schema.fields.string({
      nullable: true
    }),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    content: schema.fields.string(),
    completedAt: schema.fields.number({
      nullable: true
    }),
    position: schema.fields.object({
      properties: {
        x: schema.fields.number(),
        y: schema.fields.number()
      },
      nullable: true
    }),
    images: schema.fields.array({
      items: schema.fields.file()
    }),
    note: schema.fields.string({
      nullable: true
    }),
    assignedTo: schema.fields.string({
      nullable: true
    }),
    timeEstimateMinutes: schema.fields.number({
      nullable: true
    }),
    scheduledAt: schema.fields.number({
      nullable: true
    })
  },
  indexes: {
    projectId: {
      field: "projectId"
    }
  }
});
var connections = schema.collection({
  name: "connection",
  primaryKey: "id",
  fields: {
    id: schema.fields.string({
      default: schema.generated.id
    }),
    createdAt: schema.fields.number({
      default: () => Date.now()
    }),
    projectId: schema.fields.string(),
    sourceTaskId: schema.fields.string(),
    targetTaskId: schema.fields.string()
  },
  indexes: {
    projectId: {
      field: "projectId"
    },
    sourceTaskId: {
      field: "sourceTaskId"
    },
    targetTaskId: {
      field: "targetTaskId"
    }
  }
});
var schema_default = schema({
  version: 3,
  collections: {
    projects,
    tasks,
    connections
  }
});
export {
  schema_default as default
};
