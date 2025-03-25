import { db, userNameSelector } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import { Context } from 'hono';
import Stripe from 'stripe';
import { UI_ORIGIN } from '../config/deployedContext.js';
import { Env } from '../config/hono.js';
import { GQLContext } from '../graphql/context.js';
import { email } from '../services/email.js';
import { stripe, stripeDateToDate } from '../services/stripe.js';
import { getProductMetadata } from './products.js';

async function emailAllAdmins(
	planId: string,
	creator: (name: string) => { subject: string; text: string; html: string },
	ctx: Context<Env>,
) {
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
				email.sendCustomEmail(
					{
						to: admin.email,
						...creator(admin.name),
					},
					ctx,
				),
			),
		);
	}
}

export async function handleTrialEnd(
	event: Stripe.CustomerSubscriptionTrialWillEndEvent,
	ctx: Context<Env>,
) {
	const subscription = event.data.object;
	const { status } = subscription;

	const expiresAt =
		subscription.trial_end ?
			stripeDateToDate(subscription.trial_end)
		:	undefined;

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
	await emailAllAdmins(
		planId,
		(name) => ({
			subject: 'Your Biscuits trial is ending',
			text: `Hi ${name},\n\nYour Biscuits trial has ended. You will be charged for your first payment. You can manage (or cancel) your plan at ${UI_ORIGIN}/plan. Please contact support if you have any questions.\n\nThanks,\nGrant`,
			html: `<div>
          <p>Hi ${name},</p>
          <p>Your Biscuits trial has ended. You will be charged for your first payment. You can manage (or cancel) your plan at <a href="${UI_ORIGIN}/plan">${UI_ORIGIN}/plan</a>.</p>
          <p>Please contact support if you have any questions.</p>
          <p>Thanks,</p>
          <p>Grant</p>
          </div>`,
		}),
		ctx,
	);
}

export async function handleSubscriptionDeleted(
	event: Stripe.CustomerSubscriptionDeletedEvent,
) {
	const subscription = event.data.object;
	const { status } = subscription;

	const canceledAt =
		subscription.canceled_at ?
			stripeDateToDate(subscription.canceled_at)
		:	null;

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
	ctx: Context<Env>,
) {
	const subscription = event.data.object;
	const { status } = subscription;

	const priceId = subscription.items.data[0]?.price.id;
	const productId = subscription.items.data[0]?.price.product as string;

	const productMetadata = await getProductMetadata(productId);

	const result = await db
		.updateTable('Plan')
		.where('stripeSubscriptionId', '=', subscription.id)
		.set({
			subscriptionStatus: status,
			stripeSubscriptionId: subscription.id,
			stripePriceId: priceId,
			stripeProductId: productId,
			memberLimit: productMetadata.memberLimit,
			allowedApp: productMetadata.app === '*' ? null : productMetadata.app,
		})
		.returning('Plan.id as planId')
		.executeTakeFirst();

	if (!result?.planId) {
		throw new BiscuitsError(
			BiscuitsError.Code.BadRequest,
			'No plan found on subscription ' + subscription.id,
		);
	}

	if (
		subscription.trial_end &&
		subscription.trial_end < subscription.current_period_end
	) {
		await emailAllAdmins(
			result.planId,
			(name) => ({
				subject: 'Your Biscuits free trial has started!',
				text: `Hi ${name},\n\nYour Biscuits free trial has started! You can manage (or cancel) your plan at ${UI_ORIGIN}/plan. Please contact support if you have any questions.\n\nThanks,\nGrant`,
				html: `<div>
      <h1>Your Biscuits free trial has started!</h1>
      <p>Hi ${name},</p>
      <p>Your Biscuits free trial has started! You can manage (or cancel) your plan at <a href="${UI_ORIGIN}/plan">${UI_ORIGIN}/plan</a>. You won't be charged until ${
				stripeDateToDate(subscription.trial_end)?.toDateString() ??
				'the end of the trial'
			}.</p>
      <p>Please contact support if you have any questions.</p>
      <p>Thanks,</p>
      <p>Grant</p>
      </div>`,
			}),
			ctx,
		);
	}

	const adminEmail = await db
		.selectFrom('User')
		.select('email')
		.where('planId', '=', result.planId)
		.where('planRole', '=', 'admin')
		.executeTakeFirst();
	email
		.sendCustomEmail(
			{
				to: 'hi@biscuits.club',
				subject: 'Biscuits Subscription Created',
				text: `A new subscription was created for ${adminEmail}: https://dashboard.stripe.com/subscriptions/${subscription.id}`,
				html: `<p>A new subscription was created for ${adminEmail}: <a href="https://dashboard.stripe.com/subscriptions/${subscription.id}">Link</a></p>`,
			},
			ctx,
		)
		.catch((error) => {
			console.error('Failed to send subscription creation email', error);
		});
}

export async function handleSubscriptionUpdated(
	event: Stripe.CustomerSubscriptionUpdatedEvent,
	ctx: Context<Env>,
) {
	const subscription = event.data.object;
	const { status } = subscription;

	const canceledAt =
		subscription.canceled_at ?
			stripeDateToDate(subscription.canceled_at)
		:	null;

	const expiresAt =
		subscription.status !== 'active' ?
			subscription.current_period_end ?
				stripeDateToDate(subscription.current_period_end)
			:	null
		:	null;

	const priceId = subscription.items.data[0]?.price.id;
	const productId = subscription.items.data[0]?.price.product as string;
	// memberLimit should be set on the product metadata
	const productMetadata = await getProductMetadata(productId);

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
			memberLimit: productMetadata.memberLimit,
			allowedApp: productMetadata.app === '*' ? null : productMetadata.app,
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
		const endsAt = stripeDateToDate(
			subscription.current_period_end,
		)?.toDateString();
		// notify plan admins their subscription was cancelled
		await emailAllAdmins(
			planId,
			(name) => ({
				subject: 'Your Biscuits subscription was cancelled',
				text: `Hi ${name},\n\nYour Biscuits subscription was cancelled. Please contact support if you have any questions.\n\nThanks,\nGrant`,
				html: `<div>
            <p>Hi ${name},</p>
            <p>Your Biscuits subscription was cancelled. Your plan will remain active until ${
							endsAt ?? 'the end of the current billing period'
						}. Restart your subscription anytime at <a href="${UI_ORIGIN}/plan">${UI_ORIGIN}/plan</a>.</p>
            <p>Please contact support if you have any questions.</p>
            <p>Thanks,</p>
            <p>Grant</p>
          </div>`,
			}),
			ctx,
		);
		email
			.sendCustomEmail(
				{
					to: 'hi@biscuits.club',
					subject: 'Biscuits Subscription Cancelled',
					text: `A subscription was cancelled: https://dashboard.stripe.com/subscriptions/${subscription.id}`,
					html: `<p>A subscription was cancelled: <a href="https://dashboard.stripe.com/subscriptions/${subscription.id}">Link</a></p>`,
				},
				ctx,
			)
			.catch((error) => {
				console.error('Failed to send subscription cancelled email', error);
			});
	}

	// if member limit changed, the plan could possibly now be in violation of the limit.
	// check the number of members and update status and send an email if so
	if (productMetadata.memberLimit !== undefined) {
		const members = await db
			.selectFrom('User')
			.select(['id'])
			.where('planId', '=', planId)
			.execute();

		if (members.length > productMetadata.memberLimit) {
			await db
				.updateTable('Plan')
				.where('id', '=', planId)
				.set({
					subscriptionStatus: 'member_limit_exceeded',
				})
				.execute();

			// notify plan admins their subscription is in violation
			await emailAllAdmins(
				planId,
				(name) => ({
					subject: 'Your Biscuits subscription needs attention',
					text: `Hi ${name},\n\nYou recently changed your Biscuits subscription, and now it has more than the allowed number of members. Please visit ${UI_ORIGIN}/plan to remove extra members, or your subscription will remain paused.\n\nThanks,\nGrant`,
					html: `<div>
          <p>Hi ${name},</p>
          <p>You recently changed your Biscuits subscription, and now it has more than the allowed number of members. Please visit <a href="${UI_ORIGIN}/plan">${UI_ORIGIN}/plan</a> to remove extra members, or your subscription will remain paused.</p>
          <p>If you think this was a mistake, don't hesitate to reach out via <a href="${UI_ORIGIN}/contact">${UI_ORIGIN}/contact</a>.</p>
          <p>Thanks,</p>
          <p>Grant</p>
        </div>`,
				}),
				ctx,
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
	ctx: Context<Env>,
) {
	const paymentIntent = event.data.object;
	const subscription = await getSubscriptionIdOfPaymentIntent(paymentIntent);
	if (!subscription) {
		console.error('No subscription found on payment intent', paymentIntent);
		return;
	}

	console.error(
		'Payment intent canceled',
		subscription,
		paymentIntent.cancellation_reason,
	);

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
	await emailAllAdmins(
		plan.id,
		(name) => ({
			subject: 'Your Biscuits subscription payment was cancelled',
			text: `Hi ${name},\n\nYour Biscuits subscription payment was cancelled. Please contact support if you have any questions.\n\nThanks,\nGrant`,
			html: `<div>
          <p>Hi ${name},</p>
          <p>Your Biscuits subscription payment was cancelled. If this was a mistake, try checking out again at <a href="${UI_ORIGIN}/plan">${UI_ORIGIN}/plan</a>.</p>
          <p>Please contact support if you have any questions.</p>
          <p>Thanks,</p>
          <p>Grant</p>
          </div>`,
		}),
		ctx,
	);
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
	ctx: Context<Env>,
) {
	const paymentIntent = event.data.object;
	const subscription = await getSubscriptionIdOfPaymentIntent(paymentIntent);
	if (!subscription) {
		console.error('No subscription found on payment intent', paymentIntent);
		return;
	}

	console.error(
		'Payment intent payment failed',
		subscription,
		paymentIntent.cancellation_reason,
	);

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

	// notify plan admins their payment failed
	await emailAllAdmins(
		plan.id,
		(name) => ({
			subject: 'Your Biscuits payment failed',
			text: `Hi ${name},\n\nYour Biscuits payment failed. Please contact support if you have any questions.\n\nThanks,\nGrant`,
			html: `<div>
          <p>Hi ${name},</p>
          <p>Your Biscuits subscription payment failed. If this was a mistake, try checking out again at <a href="${UI_ORIGIN}/plan">${UI_ORIGIN}/plan</a>.</p>
          <p>Please contact support if you have any questions.</p>
          <p>Thanks,</p>
          <p>Grant</p>
          </div>`,
		}),
		ctx,
	);
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
			subscriptionStatusCheckedAt: new Date(),
			stripeProductId: productId,
			stripePriceId,
		})
		.where('id', '=', ctx.session.planId)
		.execute();
}
