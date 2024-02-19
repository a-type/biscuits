import { publicProcedure, t, userProcedure } from './common.js';
import * as z from 'zod';
import { TRPCError } from '@trpc/server';
import { id } from '@biscuits/db';

export const invitesRouter = t.router({
  details: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const invite = await ctx.db
      .selectFrom('PlanInvitation')
      .select(['inviterName'])
      .where('id', '=', input)
      .executeTakeFirst();

    if (!invite) {
      throw new TRPCError({
        message: "Couldn't find that invite",
        code: 'NOT_FOUND',
      });
    }

    return {
      inviterName: invite.inviterName,
    };
  }),

  create: userProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.planId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Plan not found',
        });
      }

      if (ctx.session.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can invite users',
        });
      }

      const plan = await ctx.db
        .selectFrom('Plan')
        .select(['id'])
        .where('id', '=', ctx.session.planId)
        .executeTakeFirst();

      if (!plan) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Plan not found',
        });
      }

      // check if the user is already a member
      const existing = await ctx.db
        .selectFrom('User')
        .select(['id', 'planId'])
        .where('email', '=', input.email)
        .executeTakeFirst();

      if (existing) {
        if (existing.planId === plan.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User is already a member',
          });
        }
        // otherwise, they might still be a member of another
        // plan, but the flow should make it clear that they
        // will have to leave that plan to join this one
      }

      // create the invite
      const inviteCode = id();
      await ctx.db
        .insertInto('PlanInvitation')
        .values({
          id: inviteCode,
          planId: plan.id,
          inviterId: ctx.session.userId,
          inviterName: ctx.session.name || 'Someone',
        })
        .execute();

      return {
        code: inviteCode,
      };
    }),

  claim: userProcedure
    .input(
      z.object({
        inviteId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.planId) {
        // TODO: cancel old plan?
      }

      const invite = await ctx.db
        .selectFrom('PlanInvitation')
        .select(['planId', 'expiresAt', 'claimedAt'])
        .where('id', '=', input.inviteId)
        .executeTakeFirst();

      if (!invite) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invite not found',
        });
      }

      if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invite has expired',
        });
      }

      if (invite.claimedAt) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invite has already been claimed',
        });
      }

      // move the user
      await ctx.db
        .updateTable('User')
        .where('id', '=', ctx.session.userId)
        .set({
          planId: invite.planId,
        })
        .executeTakeFirstOrThrow();
      const profile = await ctx.db
        .selectFrom('User')
        .select([
          'id',
          'friendlyName',
          'fullName',
          'email',
          'imageUrl',
          'planRole',
        ])
        .where('id', '=', ctx.session.userId)
        .executeTakeFirstOrThrow();

      // delete the invite
      await ctx.db
        .deleteFrom('PlanInvitation')
        .where('id', '=', input.inviteId)
        .execute();

      ctx.auth.setLoginSession({
        userId: profile.id,
        planId: invite.planId,
        name: profile.friendlyName || profile.fullName,
        role: profile.planRole as 'admin' | 'user',
        isProductAdmin: ctx.session.isProductAdmin,
      });
    }),
});
