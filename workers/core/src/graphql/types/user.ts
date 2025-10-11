import { assert } from '@a-type/utils';
import { User as DBUser } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import { builder } from '../builder.js';
import { createResults, keyIndexes } from '../dataloaders/index.js';
import { assignTypeName, hasTypeName } from '../relay.js';
import { Plan } from './plan.js';

builder.queryField('me', (t) =>
	t.field({
		type: 'User',
		nullable: false,
		authScopes: {
			user: true,
		},
		resolve: async (_, __, ctx) => {
			if (!ctx.session?.userId) {
				throw new BiscuitsError(
					BiscuitsError.Code.Unauthorized,
					'Not logged in',
				);
			}

			const user = await ctx.db
				.selectFrom('User')
				.selectAll()
				.where('id', '=', ctx.session.userId)
				.executeTakeFirst();
			if (user) {
				return assignTypeName('User')(user);
			}

			throw new BiscuitsError(
				BiscuitsError.Code.Unexpected,
				'Could not access your account. Please contact support.',
			);
		},
	}),
);
builder.queryField('user', (t) =>
	t.field({
		type: 'User',
		nullable: true,
		args: {
			id: t.arg.globalID({ required: true }),
		},
		resolve: async (_, { id }, ctx) => {
			if (id.typename !== 'User') {
				throw new BiscuitsError(
					BiscuitsError.Code.BadRequest,
					'Invalid user ID',
				);
			}

			const selfPlanId = ctx.session?.planId;
			if (!selfPlanId) {
				return null;
			}

			const user = await ctx.db
				.selectFrom('User')
				.innerJoin('Plan', 'Plan.id', 'User.planId')
				.selectAll('User')
				.where('User.id', '=', id.id)
				// only expose users on the same plan
				.where('Plan.id', '=', selfPlanId)
				.executeTakeFirst();

			if (user) {
				return assignTypeName('User')(user);
			}

			return null;
		},
	}),
);

builder.mutationFields((t) => ({
	setUserRole: t.field({
		type: User,
		authScopes: {
			productAdmin: true,
		},
		args: {
			userId: t.arg.globalID({
				required: true,
			}),
			role: t.arg({
				type: 'String',
				required: true,
			}),
		},
		resolve: async (_, { userId, role }, ctx) => {
			if (userId.typename !== 'User') {
				throw new Error('Invalid user');
			}

			if (role !== 'user' && role !== 'admin') {
				throw new Error('Invalid role');
			}

			const result = await ctx.db
				.updateTable('User')
				.set({
					planRole: role,
				})
				.where('id', '=', userId.id)
				.returning('id')
				.executeTakeFirst();

			if (!result) {
				throw new Error('User not found');
			}

			return result.id;
		},
	}),
	setUserPreference: t.field({
		type: 'SetUserPreferenceResult',
		args: {
			input: t.arg({
				type: 'SetUserPreferenceInput',
				required: true,
			}),
		},
		authScopes: {
			user: true,
		},
		resolve: async (_, args, ctx) => {
			assert(ctx.session);

			const { preferences } = await ctx.db
				.selectFrom('User')
				.select('preferences')
				.where('id', '=', ctx.session.userId)
				.executeTakeFirstOrThrow();

			await ctx.db
				.updateTable('User')
				.set({
					preferences: {
						...preferences,
						[args.input.key]: args.input.value,
					},
				})
				.executeTakeFirstOrThrow();

			return {
				userId: ctx.session.userId,
				key: args.input.key,
			};
		},
	}),
	acceptTermsOfService: t.field({
		type: User,
		authScopes: {
			user: true,
		},
		resolve: async (_, __, ctx) => {
			assert(ctx.session);
			const userId = ctx.session.userId;
			await ctx.db
				.updateTable('User')
				.set({
					acceptedTosAt: new Date(),
				})
				.where('id', '=', userId)
				.executeTakeFirstOrThrow();
			return userId;
		},
	}),
	setSendEmailUpdates: t.field({
		type: User,
		authScopes: {
			user: true,
		},
		args: {
			value: t.arg({ type: 'Boolean', required: true }),
		},
		resolve: async (_, { value }, ctx) => {
			assert(ctx.session);
			const userId = ctx.session.userId;
			await ctx.db
				.updateTable('User')
				.set({
					sendEmailUpdates: value,
				})
				.where('id', '=', userId)
				.executeTakeFirstOrThrow();
			return userId;
		},
	}),
	updateUserInfo: t.field({
		type: User,
		authScopes: {
			user: true,
		},
		args: {
			input: t.arg({
				type: 'UpdateUserInfoInput',
				required: true,
			}),
		},
		resolve: async (_, { input }, ctx) => {
			assert(ctx.session);
			const userId = ctx.session.userId;
			await ctx.db
				.updateTable('User')
				.set({
					friendlyName: input.name || undefined,
				})
				.where('id', '=', userId)
				.executeTakeFirstOrThrow();
			return userId;
		},
	}),
}));

export const User = builder.loadableNodeRef('User', {
	load: async (ids, ctx) => {
		const users = await ctx.db
			.selectFrom('User')
			.selectAll()
			.where('id', 'in', ids as string[])
			.execute();

		const indexes = keyIndexes(ids);

		const results = createResults<DBUser & { __typename: 'User' }>(ids);
		for (const result of users) {
			results[indexes[result.id]] = assignTypeName('User')(result);
		}

		return results;
	},
	id: {
		resolve: (user) => user.id,
	},
});
User.implement({
	description: 'A user in the system',

	isTypeOf: hasTypeName('User'),
	fields: (t) => ({
		name: t.string({
			resolve: (user) => user.friendlyName || user.fullName || 'Anonymous',
		}),
		role: t.exposeString('planRole', {
			nullable: true,
		}),
		plan: t.field({
			type: Plan,
			nullable: true,
			resolve: (user, _, ctx) => {
				if (user.id !== ctx.session?.userId) {
					return null;
				}
				return user.planId;
			},
		}),
		email: t.exposeString('email'),
		imageUrl: t.exposeString('imageUrl', {
			nullable: true,
		}),
		preference: t.field({
			type: 'UserPreference',
			nullable: true,
			args: {
				key: t.arg({
					type: 'String',
					required: true,
				}),
			},
			resolve: (user, args, ctx) => {
				if (user.id !== ctx.session?.userId) {
					return null;
				}
				return {
					userId: user.id,
					key: args.key,
					value: user.preferences[args.key],
				};
			},
		}),
		acceptedTermsOfServiceAt: t.field({
			type: 'DateTime',
			nullable: true,
			resolve: (user, _, ctx) => {
				if (user.id !== ctx.session?.userId) {
					return null;
				}
				return user.acceptedTosAt;
			},
		}),
		sendEmailUpdates: t.exposeBoolean('sendEmailUpdates'),
		isProductAdmin: t.exposeBoolean('isProductAdmin'),
	}),
});

builder.objectType('SetUserPreferenceResult', {
	fields: (t) => ({
		user: t.field({
			type: User,
			resolve: (parent) => parent.userId,
		}),
	}),
});

builder.objectType('UserPreference', {
	fields: (t) => ({
		id: t.id({
			resolve: (p) => `${p.userId}-${p.key}`,
		}),
		value: t.field({
			type: 'JSON',
			nullable: true,
			resolve: (p) => p.value,
		}),
	}),
});

builder.inputType('SetUserPreferenceInput', {
	fields: (t) => ({
		key: t.string({ required: true }),
		value: t.field({
			type: 'JSON',
			required: true,
		}),
	}),
});

builder.inputType('UpdateUserInfoInput', {
	fields: (t) => ({
		name: t.string({ required: false }),
	}),
});
