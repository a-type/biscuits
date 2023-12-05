import { TRPCError } from '@trpc/server';
import { t } from './common.js';
import { z } from 'zod';

// TODO: changelogs
export const changelogRouter = t.router({
  addChangelog: t.procedure
    .input(
      z.object({
        title: z.string(),
        details: z.string(),
        imageUrl: z.string().nullable().optional(),
        important: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.isProductAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized',
        });
      }
      // await ctx.db.insertInto('ChangelogItem').values({
      // 	...input,
      // }).execute();
    }),

  deleteChangelog: t.procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.isProductAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized',
        });
      }
      // await ctx.db
      //   .deleteFrom('ChangelogItem')
      //   .where('id', '=', input.id)
      //   .execute();
    }),

  updateChangelog: t.procedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        details: z.string(),
        imageUrl: z.string().nullable().optional(),
        important: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.isProductAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized',
        });
      }
      // await ctx.db
      // 	.updateTable('ChangelogItem')
      // 	.where('id', '=', input.id)
      // 	.set({
      // 		...input,
      // 	})
      // 	.execute();
    }),

  getChangelogs: t.procedure
    .input(
      z.object({
        limit: z.number().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { limit } = input;
      // const changelogs = await ctx.db
      // 	.selectFrom('ChangelogItem')
      // 	.selectAll()
      // 	.orderBy('createdAt', 'desc')
      // 	.limit(limit ?? 10)
      // 	.execute();
      // return changelogs;
    }),
});
