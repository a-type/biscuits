import { assert } from '@a-type/utils';
import { Request, Response } from 'express';
import { stripe } from '../../services/stripe.js';
import Stripe from 'stripe';
import { db } from '@biscuits/db';

assert(process.env.STRIPE_WEBHOOK_SECRET, 'STRIPE_WEBHOOK_SECRET is required');

export async function webhookHandler(req: Request, res: Response) {
  let event = req.body;

  const signature = req.headers['stripe-signature']!;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err);
    return res.sendStatus(400);
  }

  let subscription;
  let status;
  let planId;

  try {
    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        subscription = event.data.object as Stripe.Subscription;
        status = subscription.status;
        planId = subscription.metadata.planId;
        if (!planId) {
          console.error('No planId found on subscription ' + subscription.id);
          break;
        }
        await db
          .updateTable('Plan')
          .where('id', '=', planId)
          .set({
            subscriptionStatus: status,
            subscriptionExpiresAt: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : undefined,
          })
          .execute();
        break;
      case 'customer.subscription.deleted':
        subscription = event.data.object as Stripe.Subscription;
        status = subscription.status;
        planId = subscription.metadata.planId;
        if (!planId) {
          console.error('No planId found on subscription ' + subscription.id);
          break;
        }
        await db
          .updateTable('Plan')
          .where('id', '=', planId)
          .set({
            subscriptionStatus: status,
            subscriptionCanceledAt: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000).toISOString()
              : null,
          })
          .execute();
        break;
      case 'customer.subscription.created':
        subscription = event.data.object as Stripe.Subscription;
        status = subscription.status;
        planId = subscription.metadata.planId;
        if (!planId) {
          console.error('No planId found on subscription ' + subscription.id);
          break;
        }
        await db
          .updateTable('Plan')
          .where('id', '=', planId)
          .set({
            subscriptionStatus: status,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
          })
          .execute();
        break;
      case 'customer.subscription.updated':
        subscription = event.data.object as Stripe.Subscription;
        status = subscription.status;
        planId = subscription.metadata.planId;
        if (!planId) {
          console.error('No planId found on subscription ' + subscription.id);
          break;
        }
        await db
          .updateTable('Plan')
          .where('id', '=', planId)
          .set({
            subscriptionStatus: status,
            stripeSubscriptionId: subscription.id,
            subscriptionCanceledAt: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000).toISOString()
              : null,
            subscriptionExpiresAt:
              subscription.status !== 'active' &&
              subscription.status !== 'trialing'
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : null,
            stripeCustomerId: subscription.customer as string,
          })
          .execute();
        break;
    }
  } catch (err) {
    console.error('!!! Stripe webhook error');
    console.error(err);
    res.status(500).send('Error processing webhook');
  }

  res.sendStatus(200);
}
