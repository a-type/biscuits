import { z } from 'zod';
import { t } from './common.js';
import { TRPCError } from '@trpc/server';
import { jsonArrayFrom } from '@biscuits/db';
import { getLibraryName } from '@biscuits/libraries';

export const adminRouter = t.router({
  plans: t.procedure.query(async ({ ctx }) => {
    if (!ctx.isProductAdmin) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized',
      });
    }
    // TODO: pagination
    const allPlans = await ctx.db
      .selectFrom('Plan')
      .selectAll('Plan')
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('Profile')
            .select(['id', 'email', 'fullName', 'planRole'])
            .whereRef('planId', '=', 'Plan.id'),
        ).as('members'),
      ])
      .execute();
    return allPlans;
  }),
  planLibraryInfo: t.procedure
    .input(
      z.object({
        planId: z.string(),
        app: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.isProductAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized',
        });
      }
      const { planId } = input;
      return ctx.verdant.getLibraryInfo(getLibraryName(planId, input.app));
    }),
  updateFeatureFlags: t.procedure
    .input(
      z.object({
        planId: z.string(),
        featureFlags: z.record(z.string(), z.boolean()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.isProductAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized',
        });
      }
      const { planId, featureFlags } = input;
      const plan = await ctx.db
        .updateTable('Plan')
        .where('id', '=', planId)
        .set({
          featureFlags: JSON.stringify(featureFlags),
        })
        .executeTakeFirst();
      return plan;
    }),
  deletePlan: t.procedure
    .input(
      z.object({
        planId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.isProductAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized',
        });
      }
      const { planId } = input;
      const plan = await ctx.db
        .selectFrom('Plan')
        .where('id', '=', planId)
        .select((eb) => [
          jsonArrayFrom(
            eb
              .selectFrom('Profile')
              .select(['id'])
              .whereRef('planId', '=', 'Plan.id'),
          ).as('members'),
        ])
        .executeTakeFirst();

      if (!plan) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Plan not found',
        });
      }
      if (plan.members.length >= 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Plan has members',
        });
      }

      await ctx.db.deleteFrom('Plan').where('id', '=', planId).execute();
    }),
  resetSync: t.procedure
    .input(
      z.object({
        planId: z.string(),
        app: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      ctx.verdant.evictLibrary(getLibraryName(input.planId, input.app));
    }),
  updateProfile: t.procedure
    .input(
      z.object({
        profileId: z.string(),
        role: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.isProductAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized',
        });
      }
      const { profileId, role } = input;
      await ctx.db
        .updateTable('Profile')
        .where('id', '=', profileId)
        .set({
          planRole: role,
        })
        .execute();
      return {
        success: true,
      };
    }),
});
