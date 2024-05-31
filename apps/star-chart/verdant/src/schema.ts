import { schema } from '@verdant-web/store';

const projects = schema.collection({
  name: 'project',
  primaryKey: 'id',
  fields: {
    id: schema.fields.string({
      default: schema.generated.id,
    }),
    name: schema.fields.string(),
    createdAt: schema.fields.number({
      default: () => Date.now(),
    }),
  },
  indexes: {
    createdAt: {
      field: 'createdAt',
    },
  },
});

const tasks = schema.collection({
  name: 'task',
  primaryKey: 'id',
  fields: {
    id: schema.fields.string({
      default: schema.generated.id,
    }),
    projectId: schema.fields.string(),
    createdAt: schema.fields.number({
      default: () => Date.now(),
    }),
    content: schema.fields.string(),
    completedAt: schema.fields.number({
      nullable: true,
    }),
    position: schema.fields.object({
      properties: {
        x: schema.fields.number(),
        y: schema.fields.number(),
      },
    }),
  },
  indexes: {
    projectId: {
      field: 'projectId',
    },
  },
});

const connections = schema.collection({
  name: 'connection',
  primaryKey: 'id',
  fields: {
    id: schema.fields.string({
      default: schema.generated.id,
    }),
    createdAt: schema.fields.number({
      default: () => Date.now(),
    }),
    projectId: schema.fields.string(),
    sourceTaskId: schema.fields.string(),
    targetTaskId: schema.fields.string(),
  },
  indexes: {
    projectId: {
      field: 'projectId',
    },
    sourceTaskId: {
      field: 'sourceTaskId',
    },
    targetTaskId: {
      field: 'targetTaskId',
    },
  },
});

export default schema({
  version: 2,
  collections: {
    projects,
    tasks,
    connections,
  },
});
