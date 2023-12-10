import * as z from 'zod';
import { t } from './common.js';
import { TRPCError } from '@trpc/server';
import { id } from '@biscuits/db';

export const planRouter = t.router({
  create: t.procedure.mutation(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });
    }

    if (ctx.session.planId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You already have a plan',
      });
    }

    const planId = id();
    await ctx.db
      .insertInto('Plan')
      .values({
        id: planId,
        featureFlags: '{}',
        name: 'My Plan',
      })
      .executeTakeFirstOrThrow();

    await ctx.db
      .updateTable('Profile')
      .where('id', '=', ctx.session.userId)
      .set({
        planId: planId,
      })
      .execute();

    ctx.auth.setLoginSession({
      userId: ctx.session.userId,
      planId: planId,
      name: ctx.session.name,
      role: 'admin',
      isProductAdmin: ctx.session.isProductAdmin,
    });

    return {
      id: planId,
    };
  }),

  status: t.procedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });
    }

    if (!ctx.session.planId) {
      return null;
    }

    const plan = await ctx.db
      .selectFrom('Plan')
      .select([
        'id',
        'name',
        'subscriptionStatus',
        'subscriptionCanceledAt',
        'subscriptionExpiresAt',
      ])
      .where('id', '=', ctx.session.planId)
      .executeTakeFirst();

    if (!plan) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Plan not found',
      });
    }

    return {
      id: plan.id,
      name: plan.name,
      subscriptionStatus: plan.subscriptionStatus,
      subscriptionCanceledAt: plan.subscriptionCanceledAt,
      subscriptionExpiresAt: plan.subscriptionExpiresAt,
    };
  }),

  kick: t.procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Unauthorized',
        });
      }

      if (ctx.session.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can kick users',
        });
      }

      // the current user must be the plan admin
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

      const kicked = await ctx.db
        .selectFrom('Profile')
        .select(['id', 'planId'])
        .where('id', '=', input.id)
        .where('planId', '=', plan.id)
        .executeTakeFirst();

      if (!kicked) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // remove user from the plan
      await ctx.db
        .updateTable('Profile')
        .where('id', '=', kicked.id)
        .set({
          planId: null,
        })
        .execute();

      ctx.verdant.evictUser(plan.id, kicked.id);

      await ctx.db
        .insertInto('ActivityLog')
        .values({
          id: id(),
          profileId: ctx.session.userId,
          action: 'kick',
          data: JSON.stringify({
            kickedId: kicked.id,
            planId: plan.id,
          }),
        })
        .execute();
    }),

  members: t.procedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });
    }

    const members = await ctx.db
      .selectFrom('Profile')
      .select(['id', 'fullName', 'email', 'imageUrl'])
      .where('planId', '=', ctx.session.planId)
      .execute();

    if (!members) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Plan not found',
      });
    }

    return members.map((profile) => ({
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      imageUrl: profile.imageUrl,
    }));
  }),

  leave: t.procedure.mutation(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });
    }

    if (!ctx.session.planId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Plan not found',
      });
    }

    if (ctx.session.role === 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Admins cannot leave plans',
      });
    }

    // look up the membership
    const membership = await ctx.db
      .selectFrom('Profile')
      .select(['id', 'planId'])
      .where('id', '=', ctx.session.userId)
      .where('planId', '=', ctx.session.planId)
      .executeTakeFirst();

    if (!membership) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Membership not found',
      });
    }

    await ctx.db
      .updateTable('Profile')
      .where('id', '=', membership.id)
      .set({
        planId: null,
      })
      .execute();

    ctx.verdant.evictUser(ctx.session.planId, membership.id);

    await ctx.db
      .insertInto('ActivityLog')
      .values({
        id: id(),
        profileId: ctx.session.userId,
        action: 'kick',
        data: JSON.stringify({
          profileId: membership.id,
          planId: membership.planId,
        }),
      })
      .execute();

    // update the session
    ctx.auth.setLoginSession({
      userId: ctx.session.userId,
      planId: null,
      name: ctx.session.name,
      role: ctx.session.role,
      isProductAdmin: ctx.session.isProductAdmin,
    });
  }),
});
