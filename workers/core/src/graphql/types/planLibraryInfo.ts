import { assert } from '@a-type/utils';
import { BiscuitsError } from '@biscuits/error';
import { BiscuitsVerdantProfile, getLibraryName } from '@biscuits/libraries';
import { ReplicaType } from '@verdant-web/server';
import { builder } from '../builder.js';
import { Plan } from './plan.js';

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
			const library = await ctx.reqCtx.env.VERDANT_LIBRARY.getByName(
				getLibraryName({
					planId: id,
					app,
					access,
					userId: ctx.session.userId,
				}),
			);
			await library.evict();
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
		profiles: t.field({
			type: ['PlanLibraryReplicaProfile'],
			args: {
				includeTruant: t.arg.boolean(),
			},
			resolve: async (library, args, ctx) => {
				const baseReplicas =
					args.includeTruant ?
						library.replicas
					:	library.replicas.filter((replica) => !replica.truant);
				const userIds = baseReplicas
					// TODO: update when verdant types are fixed
					.map((replica) => (replica as any).userId)
					.filter((p) => !!p);
				const profilesRaw =
					await ctx.dataloaders.replicaProfileLoader.loadMany(userIds);
				const profiles = profilesRaw
					.map((p) => {
						if (p instanceof Error) {
							return null;
						}
						if (!p) return null;
						return p;
					})
					.filter((p) => !!p) as BiscuitsVerdantProfile[];
				// deduplicate
				const deduplicatedProfiles: BiscuitsVerdantProfile[] = [];
				const seen = new Set<string>();
				for (const profile of profiles) {
					if (!profile) continue;
					if (!seen.has(profile.id)) {
						deduplicatedProfiles.push(profile);
						seen.add(profile.id);
					}
				}

				return deduplicatedProfiles;
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
			nullable: true,
			resolve: async (replica, _, ctx) => {
				// TODO: update when verdant types are fixed
				const userId = (replica as any).userId;
				if (!userId) return null;
				const profile = await ctx.dataloaders.replicaProfileLoader.load(userId);
				if (profile instanceof Error) return null;
				if (!profile) return null;
				return profile;
			},
		}),
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
