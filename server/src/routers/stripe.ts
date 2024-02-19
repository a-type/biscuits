import { Router } from 'itty-router';
import { stripe } from '../services/stripe.js';
import { STRIPE_WEBHOOK_SECRET } from '../config/secrets.js';
import { BiscuitsError } from '../error.js';
import Stripe from 'stripe';
import { db } from '@biscuits/db';
import { sessions } from '../auth/session.js';
import { UI_ORIGIN } from '../config/deployedContext.js';

export const stripeRouter = Router({
  base: '/stripe',
});

stripeRouter.post('/webhook', async (req) => {
  const signature = req.headers.get('stripe-signature')!;
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err);
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'Webhook signature verification failed',
      err,
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        await handleTrialEnd(event);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event);
        break;
    }

    return new Response('OK');
  } catch (err) {
    console.error('Error handling webhook event', err);
    throw new BiscuitsError(
      BiscuitsError.Code.Unexpected,
      'Error handling webhook event',
      err,
    );
  }
});

async function handleTrialEnd(
  event: Stripe.CustomerSubscriptionTrialWillEndEvent,
) {
  const subscription = event.data.object;
  const { status, metadata } = subscription;
  const { planId } = metadata;
  if (!planId) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'No planId found on subscription ' + subscription.id,
    );
  }

  const expiresAt = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : undefined;

  await db
    .updateTable('Plan')
    .where('id', '=', planId)
    .set({
      subscriptionStatus: status,
      subscriptionExpiresAt: expiresAt,
    })
    .execute();
}

async function handleSubscriptionDeleted(
  event: Stripe.CustomerSubscriptionDeletedEvent,
) {
  const subscription = event.data.object;
  const { status, metadata } = subscription;
  const { planId } = metadata;
  if (!planId) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'No planId found on subscription ' + subscription.id,
    );
  }

  const canceledAt = subscription.canceled_at
    ? new Date(subscription.canceled_at * 1000)
    : null;

  await db
    .updateTable('Plan')
    .where('id', '=', planId)
    .set({
      subscriptionStatus: status,
      subscriptionCanceledAt: canceledAt,
    })
    .execute();
}

async function handleSubscriptionCreated(
  event: Stripe.CustomerSubscriptionCreatedEvent,
) {
  const subscription = event.data.object;
  const { status, metadata } = subscription;
  const { planId } = metadata;
  if (!planId) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'No planId found on subscription ' + subscription.id,
    );
  }

  const priceId = subscription.items.data[0]?.price.id;
  const productId = subscription.items.data[0]?.price.product as string;

  await db
    .updateTable('Plan')
    .where('id', '=', planId)
    .set({
      subscriptionStatus: status,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: priceId,
      stripeProductId: productId,
    })
    .execute();
}

async function handleSubscriptionUpdated(
  event: Stripe.CustomerSubscriptionUpdatedEvent,
) {
  const subscription = event.data.object;
  const { status, metadata } = subscription;
  const { planId } = metadata;
  if (!planId) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'No planId found on subscription ' + subscription.id,
    );
  }

  const canceledAt = subscription.canceled_at
    ? new Date(subscription.canceled_at * 1000)
    : null;

  const expiresAt =
    subscription.status !== 'active'
      ? subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null
      : null;

  const priceId = subscription.items.data[0]?.price.id;
  const productId = subscription.items.data[0]?.price.product as string;

  await db
    .updateTable('Plan')
    .where('id', '=', planId)
    .set({
      subscriptionStatus: status,
      stripeSubscriptionId: subscription.id,
      subscriptionCanceledAt: canceledAt,
      subscriptionExpiresAt: expiresAt,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: priceId,
      stripeProductId: productId,
    })
    .execute();
}

stripeRouter.post('/checkout-session', async (req) => {
  const body = await req.json();
  const priceKey = body.priceKey;

  const session = await sessions.getSession(req);
  if (!session) {
    throw new BiscuitsError(
      BiscuitsError.Code.Unauthorized,
      'Unauthorized',
      'No session found',
    );
  }

  const user = await db
    .selectFrom('User')
    .where('id', '=', session.userId)
    .select(['email', 'planId'])
    .executeTakeFirst();

  if (!user) {
    console.error(`No user for ID ${session.userId} in database`);
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'Invalid session. Please log in again.',
    );
  }

  if (!user.planId) {
    // TODO: create plan here?
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'You must create a plan before purchasing a membership.',
    );
  }

  const prices = await stripe.prices.list({
    lookup_keys: [priceKey],
    expand: ['data.product'],
  });

  const price = prices.data[0];

  if (!price) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'Could not purchase membership. Please contact support.',
    );
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    success_url: `https://${UI_ORIGIN}/account`,
    cancel_url: `https://${UI_ORIGIN}/account`,
    customer_email: user.email,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    subscription_data: {
      metadata: {
        planId: user.planId,
      },
      trial_period_days: 14,
    },
  });

  if (!checkout.url) {
    throw new BiscuitsError(
      BiscuitsError.Code.Unexpected,
      'Could not create checkout session',
    );
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: checkout.url,
    },
  });
});

stripeRouter.post('/portal-session', async (req) => {
  const session = await sessions.getSession(req);
  if (!session) {
    throw new BiscuitsError(
      BiscuitsError.Code.Unauthorized,
      'Unauthorized',
      'No session found',
    );
  }

  const user = await db
    .selectFrom('User')
    .where('id', '=', session.userId)
    .select(['email'])
    .executeTakeFirst();

  if (!user) {
    console.error(`No user for ID ${session.userId} in database`);
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'Invalid session. Please log in again.',
    );
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.email,
    return_url: `https://${UI_ORIGIN}/account`,
  });

  if (!portal.url) {
    throw new BiscuitsError(
      BiscuitsError.Code.Unexpected,
      'Could not create billing portal session',
    );
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: portal.url,
    },
  });
});
