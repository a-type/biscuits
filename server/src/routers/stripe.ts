import { db } from '@biscuits/db';
import { Hono } from 'hono';
import { sessions } from '../auth/session.js';
import { UI_ORIGIN } from '../config/deployedContext.js';
import { Env } from '../config/hono.js';
import { STRIPE_WEBHOOK_SECRET } from '../config/secrets.js';
import { BiscuitsError } from '../error.js';
import {
	handlePaymentIntentCanceled,
	handlePaymentIntentPaymentFailed,
	handlePaymentIntentProcessing,
	handlePaymentIntentSucceeded,
	handleSubscriptionCreated,
	handleSubscriptionDeleted,
	handleSubscriptionUpdated,
	handleTrialEnd,
} from '../management/subscription.js';
import { stripe } from '../services/stripe.js';

export const stripeRouter = new Hono<Env>();

stripeRouter.post('/webhook', async ({ req }) => {
	const signature = req.header('stripe-signature')!;
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
			case 'payment_intent.succeeded':
				await handlePaymentIntentSucceeded(event);
				break;
			case 'payment_intent.processing':
				await handlePaymentIntentProcessing(event);
				break;
			case 'payment_intent.canceled':
				await handlePaymentIntentCanceled(event);
				break;
			case 'payment_intent.payment_failed':
				await handlePaymentIntentPaymentFailed(event);
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

stripeRouter.post('/checkout-session', async ({ req }) => {
	const body = await req.json();
	const priceKey = body.priceKey;

	const session = await sessions.getSession(req.raw);
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
		success_url: `${UI_ORIGIN}/account`,
		cancel_url: `${UI_ORIGIN}/account`,
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

stripeRouter.post('/portal-session', async ({ req }) => {
	const session = await sessions.getSession(req.raw);
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
		.select(['email', 'stripeCustomerId'])
		.executeTakeFirst();

	if (!user) {
		console.error(`No user for ID ${session.userId} in database`);
		throw new BiscuitsError(
			BiscuitsError.Code.BadRequest,
			'Invalid session. Please log in again.',
		);
	}

	if (!user.stripeCustomerId) {
		throw new BiscuitsError(
			BiscuitsError.Code.BadRequest,
			'You are not the manager of the billing for your plan. Please contact whoever is to update the subscription.',
		);
	}

	const portal = await stripe.billingPortal.sessions.create({
		customer: user.stripeCustomerId,
		return_url: `${UI_ORIGIN}/plan`,
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
