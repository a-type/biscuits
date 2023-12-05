import { TRPCError } from '@trpc/server';
import { t } from './common.js';
import * as z from 'zod';

export const subscriptionRouter = t.router({
  checkout: t.procedure
    .input(
      z.object({
        priceKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Unauthorized',
        });
      }

      const profile = await ctx.db
        .selectFrom('Profile')
        .where('id', '=', ctx.session.userId)
        .select(['email'])
        .executeTakeFirst();

      if (!profile) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid session. Please log in again.',
        });
      }

      const prices = await ctx.stripe.prices.list({
        lookup_keys: [input.priceKey],
        expand: ['data.product'],
      });

      const price = prices.data[0];

      if (!price) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Price not found',
        });
      }

      const checkout = await ctx.stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        success_url: `https://${ctx.deployedContext.uiOrigin}/account`,
        cancel_url: `https://${ctx.deployedContext.uiOrigin}/account`,
        customer_email: profile.email,
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        subscription_data: {
          metadata: {
            planId: ctx.session.planId,
          },
          trial_period_days: 14,
        },
      });

      if (!checkout.url) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error creating checkout session',
        });
      }

      ctx.res.redirect(checkout.url);
    }),

  portal: t.procedure
    .input(
      z.object({
        returnTo: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Unauthorized',
        });
      }

      if (!ctx.session.planId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "You aren't subscribed.",
        });
      }

      const plan = await ctx.db
        .selectFrom('Plan')
        .select(['id', 'stripeCustomerId'])
        .where('id', '=', ctx.session.planId)
        .executeTakeFirst();

      if (!plan) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Plan not found',
        });
      }

      if (!plan.stripeCustomerId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "You aren't subscribed.",
        });
      }

      const session = await ctx.stripe.billingPortal.sessions.create({
        customer: plan.stripeCustomerId,
        return_url: `https://${ctx.deployedContext.uiOrigin}/account`,
      });

      if (!session.url) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error creating portal session',
        });
      }

      ctx.res.redirect(session.url);
    }),
});
