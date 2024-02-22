import { id } from '@biscuits/db';
import { BiscuitsError } from '../../error.js';
import { builder } from '../builder.js';
import { assignTypeName, hasTypeName } from '../relay.js';
import { removeUserFromPlan } from '../../management/plans.js';

builder.queryField('planInvitation', (t) =>
  t.field({
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
);

builder.mutationFields((t) => ({
  createPlanInvitation: t.node({
    authScopes: {
      planAdmin: true,
    },
    args: {
      input: t.arg({
        type: 'CreatePlanInvitationInput',
        required: true,
      }),
    },
    id: async (_, { input }, ctx) => {
      if (!ctx.session?.planId) {
        throw new BiscuitsError(BiscuitsError.Code.NoPlan);
      }

      const planId = ctx.session.planId;

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
      await ctx.db
        .insertInto('PlanInvitation')
        .values({
          id: inviteCode,
          planId,
          inviterId: ctx.session.userId,
          inviterName: ctx.session.name || 'Someone',
        })
        .execute();

      return { id: inviteCode, type: 'PlanInvitation' };
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
      if (ctx.session.planId) {
        // remove the user from their old plan
        await removeUserFromPlan(ctx.session.planId, ctx.session.userId);
      }

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

      await ctx.db.transaction().execute(async (tx) => {
        await tx
          .updateTable('User')
          .where('id', '=', userId)
          .set({
            planId: invite.planId,
            planRole: 'user',
          })
          .execute();
        await tx
          .updateTable('PlanInvitation')
          .where('id', '=', code)
          .set({
            claimedAt: new Date(),
          })
          .execute();
      });

      await ctx.auth.setLoginSession({
        ...ctx.session,
        planId: invite.planId,
        role: 'user',
      });

      return {
        userId,
        planId: invite.planId,
      };
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
    code: t.exposeString('id'),
    inviterName: t.exposeString('inviterName'),
  }),
});

builder.objectType('ClaimPlanInvitationResult', {
  fields: (t) => ({
    user: t.node({
      id: (result) => ({ id: result.userId, type: 'User' }),
    }),
    plan: t.node({
      id: (result) => ({ id: result.planId, type: 'Plan' }),
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
