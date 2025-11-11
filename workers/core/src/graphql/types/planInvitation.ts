import { id } from '@biscuits/db';
import { BiscuitsError } from '../../error.js';
import {
	canPlanAcceptAMember,
	removeUserFromPlan,
} from '../../management/plans.js';
import { email } from '../../services/email.js';
import { builder } from '../builder.js';
import { assignTypeName, hasTypeName } from '../relay.js';
import { Plan } from './plan.js';
import { User } from './user.js';

builder.queryFields((t) => ({
	planInvitation: t.field({
		type: 'PlanInvitation',
		args: {
			code: t.arg({
				type: 'String',
				required: true,
			}),
		},
		nullable: true,
		resolve: async (_, { code }, ctx) => {
			const result = await ctx.db
				.selectFrom('PlanInvitation')
				.selectAll()
				.where('id', '=', code)
				.executeTakeFirst();
			if (result) {
				return assignTypeName('PlanInvitation')(result);
			}
			return null;
		},
	}),
}));

builder.mutationFields((t) => ({
	createPlanInvitation: t.field({
		type: 'CreatePlanInvitationResult',
		authScopes: {
			planAdmin: true,
		},
		args: {
			input: t.arg({
				type: 'CreatePlanInvitationInput',
				required: true,
			}),
		},
		resolve: async (_, { input }, ctx) => {
			if (!ctx.session?.planId) {
				throw new BiscuitsError(BiscuitsError.Code.NoPlan);
			}

			const planId = ctx.session.planId;

			const memberCheck = await canPlanAcceptAMember(planId, ctx);

			if (!memberCheck.ok) {
				throw new BiscuitsError(memberCheck.code);
			}

			const existingUser = await ctx.db
				.selectFrom('User')
				.select(['id', 'planId'])
				.where('email', '=', input.email)
				.executeTakeFirst();

			if (existingUser) {
				if (existingUser.planId === planId) {
					throw new BiscuitsError(
						BiscuitsError.Code.BadRequest,
						'User is already a member',
					);
				}
				// otherwise, they might be a member of another plan
				// but the flow should make it clear that they're leaving
				// that plan to join this one when they get the invite.
			}

			const inviteCode = id();
			const invite = await ctx.db
				.insertInto('PlanInvitation')
				.values({
					id: inviteCode,
					planId,
					inviterId: ctx.session.userId,
					inviterName: ctx.session.name || 'Someone',
					email: input.email,
					expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			await email.sendCustomEmail(
				{
					to: input.email,
					subject: 'You have been invited to join a Biscuits plan',
					text: `You have been invited to join a Biscuits plan. To accept the invitation, visit this URL: ${ctx.reqCtx.env.UI_ORIGIN}/invite/${inviteCode}`,
					html: `You have been invited to join a Biscuits plan. To accept the invitation, click the following link: <a href="${ctx.reqCtx.env.UI_ORIGIN}/invite/${inviteCode}">Accept invitation</a>`,
				},
				ctx.reqCtx,
			);

			return {
				planId,
				planInvitationId: invite.id,
			};
		},
	}),

	claimPlanInvitation: t.field({
		type: 'ClaimPlanInvitationResult',
		authScopes: {
			user: true,
		},
		args: {
			code: t.arg({
				type: 'String',
				required: true,
			}),
		},
		resolve: async (_, { code }, ctx) => {
			if (!ctx.session) {
				throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
			}

			// first validate the invite
			const { userId } = ctx.session;

			const invite = await ctx.db
				.selectFrom('PlanInvitation')
				.select(['planId', 'expiresAt', 'claimedAt'])
				.where('id', '=', code)
				.executeTakeFirst();

			if (!invite) {
				throw new BiscuitsError(BiscuitsError.Code.NotFound);
			}

			if (invite.claimedAt) {
				throw new BiscuitsError(
					BiscuitsError.Code.BadRequest,
					'Invite already claimed',
				);
			}

			if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
				throw new BiscuitsError(
					BiscuitsError.Code.BadRequest,
					'Invite expired',
				);
			}

			// make sure the plan can accept more members
			const memberCheck = await canPlanAcceptAMember(invite.planId, ctx);

			if (!memberCheck.ok) {
				throw new BiscuitsError(memberCheck.code);
			}

			if (ctx.session.planId) {
				// remove the user from their old plan
				await removeUserFromPlan(ctx.session.planId, ctx.session.userId, ctx);
			}

			await ctx.db
				.updateTable('User')
				.where('id', '=', userId)
				.set({
					planId: invite.planId,
					planRole: 'user',
				})
				.execute();
			await ctx.db
				.updateTable('PlanInvitation')
				.where('id', '=', code)
				.set({
					claimedAt: new Date(),
				})
				.execute();

			// get plan info needed for session
			const plan = await ctx.db
				.selectFrom('Plan')
				.where('id', '=', invite.planId)
				.select(['id', 'allowedApp'])
				.executeTakeFirstOrThrow();

			await ctx.auth.setLoginSession({
				...ctx.session,
				planId: plan.id,
				allowedApp: plan.allowedApp || undefined,
				role: 'user',
			});

			return {
				userId,
				planId: invite.planId,
			};
		},
	}),

	cancelPlanInvitation: t.field({
		type: 'CancelPlanInvitationResult',
		authScopes: {
			planAdmin: true,
		},
		args: {
			id: t.arg.globalID({
				required: true,
			}),
		},
		resolve: async (_, { id: { id } }, ctx) => {
			if (!ctx.session?.planId) {
				throw new BiscuitsError(BiscuitsError.Code.NoPlan);
			}
			const result = await ctx.db
				.deleteFrom('PlanInvitation')
				.where('id', '=', id)
				.where('planId', '=', ctx.session.planId)
				.returning(['planId'])
				.executeTakeFirst();

			if (!result) {
				throw new BiscuitsError(BiscuitsError.Code.NotFound);
			}

			return { planId: result.planId };
		},
	}),
}));

export const PlanInvitation = builder.node('PlanInvitation', {
	description: 'An invitation to join a plan',
	id: {
		resolve: (planInvitation) => planInvitation.id,
	},
	isTypeOf: hasTypeName('PlanInvitation'),
	loadOne: async (id, ctx) => {
		const result = await ctx.db
			.selectFrom('PlanInvitation')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();

		if (!result) return null;

		return assignTypeName('PlanInvitation')(result);
	},
	fields: (t) => ({
		inviterName: t.exposeString('inviterName'),
		email: t.exposeString('email', {
			authScopes: {
				planAdmin: true,
			},
		}),
	}),
});

builder.objectType('ClaimPlanInvitationResult', {
	fields: (t) => ({
		user: t.field({
			type: User,
			resolve: (result) => result.userId,
		}),
		plan: t.field({
			type: Plan,
			resolve: (result) => result.planId,
		}),
	}),
});

builder.inputType('CreatePlanInvitationInput', {
	fields: (t) => ({
		email: t.string({
			description: 'The email address of the person to invite',
			required: true,
		}),
	}),
});

builder.objectType('CreatePlanInvitationResult', {
	fields: (t) => ({
		plan: t.field({
			type: Plan,
			resolve: (result) => result.planId,
		}),
	}),
});

builder.objectType('CancelPlanInvitationResult', {
	fields: (t) => ({
		plan: t.field({
			type: Plan,
			resolve: (result) => result.planId,
		}),
	}),
});
