import { t } from './common.js';

// TODO: managed push notifications
export const pushNotificationsRouter = t.router({
  // subscribeToPushNotifications: t.procedure
  //   .input(
  //     z.object({
  //       endpoint: z.string(),
  //       keys: z.object({
  //         p256dh: z.string(),
  //         auth: z.string(),
  //       }),
  //     }),
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     if (!ctx.session) {
  //       throw new TRPCError({
  // 				code: 'UNAUTHORIZED',
  // 				message: 'Unauthorized',
  // 			});
  //     }
  //     const plan = await ctx.db.selectFrom('Plan')
  // 			.select(['id'])
  // 			.where('id', '=', ctx.session.planId)
  // 			.executeTakeFirst();
  //     if (!plan) {
  //       throw new TRPCError({
  // 				code: 'NOT_FOUND',
  // 				message: 'Plan not found',
  // 			});
  //     }
  //     await ctx.db.insertInto('PushSubscription')
  // 			.where('endpoint', '=', input.endpoint)
  // 			.values({
  //         endpoint: input.endpoint,
  //         p256dh: input.keys.p256dh,
  //         auth: input.keys.auth,
  //         profileId: ctx.session.userId,
  // 			});
  //   }),
  // unsubscribeFromPushNotifications: t.procedure
  //   .input(
  //     z.object({
  //       endpoint: z.string(),
  //     }),
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     if (!ctx.session) {
  //       throw new TRPCError({
  // 				code: 'UNAUTHORIZED',
  // 				message: 'Unauthorized',
  // 			});
  //     }
  //     const plan = await prisma.plan.findUnique({
  //       where: {
  //         id: ctx.session.planId,
  //       },
  //     });
  //     if (!plan) {
  //       throw new TRPCError({
  // 				code: 'NOT_FOUND',
  // 				message: 'Plan not found',
  // 			});
  //     }
  //     await prisma.pushSubscription.delete({
  //       where: {
  //         endpoint: input.endpoint,
  //       },
  //     });
  //   }),
});
