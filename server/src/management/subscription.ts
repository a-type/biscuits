import Stripe from 'stripe';
import { BiscuitsError } from '@biscuits/error';
import { db, userNameSelector } from '@biscuits/db';
import { email } from '../services/email.js';
import { stripe, stripeDateToDate } from '../services/stripe.js';
import { GQLContext } from '../graphql/context.js';

export async function handleTrialEnd(
  event: Stripe.CustomerSubscriptionTrialWillEndEvent,
) {
  const subscription = event.data.object;
  const { status } = subscription;

  const expiresAt = subscription.trial_end
    ? stripeDateToDate(subscription.trial_end)
    : undefined;

  const result = await db
    .updateTable('Plan')
    .where('stripeSubscriptionId', '=', subscription.id)
    .set({
      subscriptionStatus: status,
      subscriptionExpiresAt: expiresAt,
    })
    .returning(['Plan.id as planId'])
    .executeTakeFirst();

  if (!result) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'No plan found on subscription ' + subscription.id,
    );
  }

  // notify plan admins their trial is ending
  const planId = result.planId;
  const admins = await db
    .selectFrom('User')
    .select(['id', 'email'])
    .select(userNameSelector)
    .where('planId', '=', planId)
    .where('planRole', '=', 'admin')
    .execute();

  if (admins.length > 0) {
    await Promise.all(
      admins.map((admin) =>
        email.sendMail({
          to: admin.email,
          subject: 'Your Biscuits trial is ending',
          text: `Hi ${admin.name},\n\nYour Biscuits trial has ended. You will be charged for your first payment. Please contact support if you have any questions.\n\nThanks,\nGrant`,
          html: `Hi ${admin.name},<br><br>Your Biscuits trial has ended. You will be charged for your first payment. Please contact support if you have any questions.<br><br>Thanks,<br>Grant`,
        }),
      ),
    );
  }
}

export async function handleSubscriptionDeleted(
  event: Stripe.CustomerSubscriptionDeletedEvent,
) {
  const subscription = event.data.object;
  const { status } = subscription;

  const canceledAt = subscription.canceled_at
    ? stripeDateToDate(subscription.canceled_at)
    : null;

  const result = await db
    .updateTable('Plan')
    .where('stripeSubscriptionId', '=', subscription.id)
    .set({
      subscriptionStatus: status,
      subscriptionCanceledAt: canceledAt,
    })
    .executeTakeFirst();

  if (!result.numUpdatedRows) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'No plan found on subscription ' + subscription.id,
    );
  }
}

export async function handleSubscriptionCreated(
  event: Stripe.CustomerSubscriptionCreatedEvent,
) {
  const subscription = event.data.object;
  const { status } = subscription;

  const priceId = subscription.items.data[0]?.price.id;
  const productId = subscription.items.data[0]?.price.product as string;

  const result = await db
    .updateTable('Plan')
    .where('stripeSubscriptionId', '=', subscription.id)
    .set({
      subscriptionStatus: status,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeProductId: productId,
    })
    .executeTakeFirst();

  if (!result.numUpdatedRows) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'No plan found on subscription ' + subscription.id,
    );
  }
}

export async function handleSubscriptionUpdated(
  event: Stripe.CustomerSubscriptionUpdatedEvent,
) {
  const subscription = event.data.object;
  const { status } = subscription;

  const canceledAt = subscription.canceled_at
    ? stripeDateToDate(subscription.canceled_at)
    : null;

  const expiresAt =
    subscription.status !== 'active'
      ? subscription.current_period_end
        ? stripeDateToDate(subscription.current_period_end)
        : null
      : null;

  const priceId = subscription.items.data[0]?.price.id;
  const productId = subscription.items.data[0]?.price.product as string;

  const updated = await db
    .updateTable('Plan')
    .where('stripeSubscriptionId', '=', subscription.id)
    .set({
      subscriptionStatus: status,
      stripeSubscriptionId: subscription.id,
      subscriptionCanceledAt: canceledAt,
      subscriptionExpiresAt: expiresAt,
      stripePriceId: priceId,
      stripeProductId: productId,
    })
    .returning(['Plan.id as planId'])
    .executeTakeFirst();

  if (!updated) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'No plan found on subscription ' + subscription.id,
    );
  }

  const planId = updated.planId;

  if (!!canceledAt) {
    // notify plan admins their subscription was cancelled
    const admins = await db
      .selectFrom('User')
      .select(['id', 'email'])
      .select(userNameSelector)
      .where('planId', '=', planId)
      .where('planRole', '=', 'admin')
      .execute();

    if (admins.length > 0) {
      await Promise.all(
        admins.map((admin) =>
          email.sendMail({
            to: admin.email,
            subject: 'Your Biscuits subscription was cancelled',
            text: `Hi ${admin.name},\n\nYour Biscuits subscription was cancelled. Please contact support if you have any questions.\n\nThanks,\nGrant`,
            html: `Hi ${admin.name},<br><br>Your Biscuits subscription was cancelled. Please contact support if you have any questions.<br><br>Thanks,<br>Grant`,
          }),
        ),
      );
    }
  }
}

async function getSubscriptionIdOfPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
) {
  // fetch the invoice
  const invoice = await stripe.invoices.retrieve(
    paymentIntent.invoice as string,
    {},
  );
  if (!invoice.subscription) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'No subscription found on invoice ' + invoice.id,
    );
  }
  return invoice.subscription as string | undefined;
}

export async function handlePaymentIntentSucceeded(
  event: Stripe.PaymentIntentSucceededEvent,
) {
  const paymentIntent = event.data.object;
  const subscription = await getSubscriptionIdOfPaymentIntent(paymentIntent);
  if (!subscription) {
    console.error('No subscription found on payment intent', paymentIntent);
    return;
  }

  const plan = await db
    .selectFrom('Plan')
    .select(['id', 'subscriptionStatus'])
    .where('stripeSubscriptionId', '=', subscription)
    .executeTakeFirst();

  if (!plan) {
    console.error('No plan found for subscription', subscription);
    return;
  }

  if (plan.subscriptionStatus === 'active') {
    console.error('Plan already active', plan);
    return;
  }

  await db
    .updateTable('Plan')
    .where('id', '=', plan.id)
    .set({
      subscriptionStatus: 'active',
    })
    .execute();
}

export async function handlePaymentIntentCanceled(
  event: Stripe.PaymentIntentCanceledEvent,
) {
  const paymentIntent = event.data.object;
  const subscription = await getSubscriptionIdOfPaymentIntent(paymentIntent);
  if (!subscription) {
    console.error('No subscription found on payment intent', paymentIntent);
    return;
  }

  const plan = await db
    .selectFrom('Plan')
    .select(['id', 'subscriptionStatus'])
    .where('stripeSubscriptionId', '=', subscription)
    .executeTakeFirst();

  if (!plan) {
    console.error('No plan found for subscription', subscription);
    return;
  }

  if (plan.subscriptionStatus === 'canceled') {
    console.error('Plan already canceled', plan);
    return;
  }

  await db
    .updateTable('Plan')
    .where('id', '=', plan.id)
    .set({
      subscriptionStatus: 'canceled',
    })
    .execute();

  // notify plan admins their subscription was cancelled
  const admins = await db
    .selectFrom('User')
    .select(['id', 'email'])
    .select(userNameSelector)
    .where('planId', '=', plan.id)
    .where('planRole', '=', 'admin')
    .execute();

  if (admins.length > 0) {
    await Promise.all(
      admins.map((admin) =>
        email.sendMail({
          to: admin.email,
          subject: 'Your Biscuits subscription was cancelled',
          text: `Hi ${admin.name},\n\nYour Biscuits subscription was cancelled. Please contact support if you have any questions.\n\nThanks,\nGrant`,
          html: `Hi ${admin.name},<br><br>Your Biscuits subscription was cancelled. Please contact support if you have any questions.<br><br>Thanks,<br>Grant`,
        }),
      ),
    );
  }
}

export async function handlePaymentIntentProcessing(
  event: Stripe.PaymentIntentProcessingEvent,
) {
  const paymentIntent = event.data.object;
  const subscription = await getSubscriptionIdOfPaymentIntent(paymentIntent);
  if (!subscription) {
    console.error('No subscription found on payment intent', paymentIntent);
    return;
  }

  const plan = await db
    .selectFrom('Plan')
    .select(['id', 'subscriptionStatus'])
    .where('stripeSubscriptionId', '=', subscription)
    .executeTakeFirst();

  if (!plan) {
    console.error('No plan found for subscription', subscription);
    return;
  }

  if (plan.subscriptionStatus === 'active') {
    console.error('Plan already active', plan);
    return;
  }

  await db
    .updateTable('Plan')
    .where('id', '=', plan.id)
    .set({
      subscriptionStatus: 'processing',
    })
    .execute();
}

export async function handlePaymentIntentPaymentFailed(
  event: Stripe.PaymentIntentPaymentFailedEvent,
) {
  const paymentIntent = event.data.object;
  const subscription = await getSubscriptionIdOfPaymentIntent(paymentIntent);
  if (!subscription) {
    console.error('No subscription found on payment intent', paymentIntent);
    return;
  }

  const plan = await db
    .selectFrom('Plan')
    .select(['id', 'subscriptionStatus'])
    .where('stripeSubscriptionId', '=', subscription)
    .executeTakeFirst();

  if (!plan) {
    console.error('No plan found for subscription', subscription);
    return;
  }

  if (plan.subscriptionStatus === 'active') {
    console.error('Plan already active', plan);
    return;
  }

  await db
    .updateTable('Plan')
    .where('id', '=', plan.id)
    .set({
      subscriptionStatus: 'payment_failed',
    })
    .execute();

  // notify plan admins their subscription payment failed
  const admins = await db
    .selectFrom('User')
    .select(['id', 'email'])
    .select(userNameSelector)
    .where('planId', '=', plan.id)
    .where('planRole', '=', 'admin')
    .execute();

  if (admins.length > 0) {
    await Promise.all(
      admins.map((admin) =>
        email.sendMail({
          to: admin.email,
          subject: '[Action needed] Your Biscuits subscription payment failed',
          text: `Hi ${admin.name},\n\nYour Biscuits subscription payment failed. Please contact support if you have any questions.\n\nThanks,\nGrant`,
          html: `Hi ${admin.name},<br><br>Your Biscuits subscription payment failed. Please contact support if you have any questions.<br><br>Thanks,<br>Grant`,
        }),
      ),
    );
  }
}

export async function cacheSubscriptionInfoOnPlan(
  subscription: Stripe.Subscription,
  ctx: GQLContext,
) {
  if (!ctx.session?.planId) {
    return;
  }

  const productId = subscription.items.data[0]?.price.product as
    | string
    | undefined;
  const stripePriceId = subscription.items.data[0]?.price.id as
    | string
    | undefined;
  await ctx.db
    .updateTable('Plan')
    .set({
      subscriptionStatus: subscription.status,
      // go ahead and cache the rest
      subscriptionCanceledAt: stripeDateToDate(subscription.canceled_at),
      subscriptionExpiresAt: stripeDateToDate(subscription.current_period_end),
      subscriptionStatusCheckedAt: Date.now(),
      stripeProductId: productId,
      stripePriceId,
    })
    .where('id', '=', ctx.session.planId)
    .execute();
}
