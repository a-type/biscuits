import { ReplicaType } from '@verdant-web/server';
import { builder } from '../builder.js';
import { getLibraryName } from '@biscuits/libraries';

builder.mutationFields((t) => ({
  resetSync: t.field({
    type: 'Boolean',
    authScopes: {
      productAdmin: true,
    },
    args: {
      app: t.arg({
        type: 'String',
        required: true,
      }),
      planId: t.arg.globalID({
        required: true,
      }),
    },
    resolve: async (_, { app, planId: { id } }, ctx) => {
      ctx.verdant.evictLibrary(getLibraryName(id, app));
      return true;
    },
  }),
}));

builder.objectType('PlanLibraryInfo', {
  description: 'Information about a Verdant library',
  fields: (t) => ({
    replicas: t.field({
      type: ['PlanLibraryReplica'],
      resolve: (library) => library.replicas,
    }),
    latestServerOrder: t.exposeInt('latestServerOrder'),
    operationsCount: t.exposeInt('operationsCount'),
    baselinesCount: t.exposeInt('baselinesCount'),
    globalAck: t.exposeString('globalAck', {
      nullable: true,
    }),
  }),
});

builder.objectType('PlanLibraryReplica', {
  description: 'A client replica of a Verdant library',
  fields: (t) => ({
    id: t.exposeID('id'),
    ackedLogicalTime: t.exposeString('ackedLogicalTime', {
      nullable: true,
    }),
    ackedServerOrder: t.exposeInt('ackedServerOrder'),
    type: t.field({
      type: ReplicaType,
      resolve: (replica) => replica.type,
    }),
    truant: t.boolean({
      resolve: (replica) => !!replica.truant,
    }),
    // TODO: profile - once it's decided what a Biscuits Profile type is.
  }),
});

builder.enumType(ReplicaType, {
  name: 'ReplicaType',
});
