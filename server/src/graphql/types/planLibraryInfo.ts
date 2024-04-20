import { ReplicaType } from '@verdant-web/server';
import { builder } from '../builder.js';
import { getLibraryName } from '@biscuits/libraries';
import { BiscuitsError } from '@biscuits/error';
import { Plan } from './plan.js';
import { assert } from '@a-type/utils';

builder.mutationFields((t) => ({
  resetSync: t.field({
    type: 'ResetSyncResult',
    authScopes: {
      productAdmin: true,
    },
    args: {
      app: t.arg({
        type: 'String',
        required: true,
      }),
      planId: t.arg.globalID(),
      access: t.arg.string({
        required: true,
      }),
    },
    resolve: async (_, { app, planId, access }, ctx) => {
      assert(ctx.session?.userId, 'Session required');
      if (planId && !ctx.session?.isProductAdmin) {
        throw new BiscuitsError(BiscuitsError.Code.Forbidden);
      }
      const id = planId?.id ?? ctx.session?.planId;
      if (!id) {
        throw new BiscuitsError(BiscuitsError.Code.BadRequest);
      }
      if (access !== 'members' && access !== 'user') {
        throw new BiscuitsError(
          BiscuitsError.Code.BadRequest,
          'Invalid access type',
        );
      }
      ctx.verdant.evictLibrary(
        getLibraryName({
          planId: id,
          app,
          access,
          userId: ctx.session.userId,
        }),
      );
      return {
        planId: id,
      };
    },
  }),
}));

builder.objectType('PlanLibraryInfo', {
  description: 'Information about a Verdant library',
  fields: (t) => ({
    id: t.exposeID('id'),
    replicas: t.field({
      type: ['PlanLibraryReplica'],
      args: {
        includeTruant: t.arg.boolean(),
      },
      resolve: (library, args) => {
        if (args.includeTruant) {
          return library.replicas;
        } else {
          return library.replicas.filter((replica) => !replica.truant);
        }
      },
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
    profile: t.field({
      type: 'PlanLibraryReplicaProfile',
      resolve: (replica) => replica.profile as any,
    }),
    // TODO: profile - once it's decided what a Biscuits Profile type is.
  }),
});

builder.enumType(ReplicaType, {
  name: 'ReplicaType',
});

builder.objectType('PlanLibraryReplicaProfile', {
  description: 'The profile that owns a replica',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    imageUrl: t.exposeString('imageUrl', {
      nullable: true,
    }),
  }),
});

builder.objectType('ResetSyncResult', {
  description: 'Result of a reset sync operation',
  fields: (t) => ({
    plan: t.field({
      type: Plan,
      resolve: (result) => result.planId,
    }),
  }),
});
