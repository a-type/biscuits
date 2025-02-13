import { assert } from '@a-type/utils';
import { db, id, jsonArrayFrom } from '@biscuits/db';
import { BiscuitsError, BiscuitsErrorCode } from '@biscuits/error';
import { isSubscribed } from '../auth/subscription.js';
import { UI_ORIGIN } from '../config/deployedContext.js';
import { GQLContext } from '../graphql/context.js';
import { email } from '../services/email.js';
import { stripe } from '../services/stripe.js';
import { getProductMetadata } from './products.js';

export async function removeUserFromPlan(
	planId: string,
	userId: string,
	ctx: GQLContext,
) {
	return ctx.db.transaction().execute(async (tx) => {
		// if user was admin of their plan and there are no other admins,
		// promote another user to admin. if there are no other users,
		// delete the plan
		const plan = await tx
			.selectFrom('Plan')
			.select(['id', 'stripeSubscriptionId'])
			.where('id', '=', planId)
			.select((eb) => [
				jsonArrayFrom(
					eb
						.selectFrom('User')
						.select(['id', 'planRole', 'stripeCustomerId'])
						.whereRef('planId', '=', 'Plan.id'),
				).as('members'),
			])
			.executeTakeFirst();

		if (!plan) {
			throw new BiscuitsError(BiscuitsError.Code.NoPlan);
		}

		const userMember = plan.members.find((m) => m.id === userId);
		if (!userMember) {
			console.error('User not found in plan from their session', {
				planId,
				userId,
			});
			throw new BiscuitsError(BiscuitsError.Code.SessionInvalid);
		}

		// if they're not an admin, just remove them. if there's
		// another admin, we can rely on them.
		const canJustDeleteThem =
			userMember.planRole !== 'admin' ||
			plan.members.filter((m) => m.planRole === 'admin').length > 1;
		if (!canJustDeleteThem) {
			// user was the only admin, so we need to promote someone else

			// when the only admin leaves, we always cancel the subscription, too.
			if (plan.stripeSubscriptionId) {
				await cancelSubscription(planId, userId, plan.stripeSubscriptionId);
			}

			const newAdmin = plan.members.find((m) => m.planRole === 'user');
			if (!newAdmin) {
				// no other users, so delete the plan.
				await tx.deleteFrom('Plan').where('id', '=', planId).execute();
				await tx
					.insertInto('ActivityLog')
					.values({
						action: 'deletePlan',
						id: id(),
						userId,
						data: JSON.stringify({
							planId,
							reason: 'all users left',
						}),
					})
					.execute();
				return;
			} else {
				// promote the new admin
				const newAdminDetails = await tx
					.updateTable('User')
					.where('id', '=', newAdmin.id)
					.set({
						planRole: 'admin',
					})
					.returning(['id', 'email', 'fullName'])
					.executeTakeFirstOrThrow();

				// send an email to the new admin about their new role
				await email.sendCustomEmail(
					{
						to: newAdminDetails.email,
						subject: 'You are now the admin of your Biscuits plan',
						text: `Hi ${newAdminDetails.fullName},\n
          You are now the admin of your Biscuits plan. This usually happens because the previous admin left the plan. Your plan may require a new payment method to remain active.\n
          You can manage your plan at ${UI_ORIGIN}/plan.\n
          Thanks,
          Grant`,
						html: `<div>
            <p>Hi ${newAdminDetails.fullName},</p>
            <p>
              You are now the admin of your Biscuits plan. This usually happens because the previous admin left the plan. Your plan may require a new payment method to remain active.
              You can manage your plan at <a href="${UI_ORIGIN}/plan">${UI_ORIGIN}/plan</a>.
            </p>
            <p>Thanks,</p>
            <p>Grant</p>
          </div>`,
					},
					ctx.reqCtx,
				);
			}
		} else {
			// if the subscription is under their customer ID, we must
			// cancel it.
			if (userMember.stripeCustomerId && plan.stripeSubscriptionId) {
				const subscriptionDetails = await stripe.subscriptions.retrieve(
					plan.stripeSubscriptionId,
				);
				if (subscriptionDetails.customer === userMember.stripeCustomerId) {
					await cancelSubscription(planId, userId, plan.stripeSubscriptionId);
					// an automated email from the webhook will notify other admins the
					// subscription is canceled.
				}
			}
		}

		// null out the old admin's planId and planRole
		const removedUser = await tx
			.updateTable('User')
			.where('id', '=', userId)
			.set({
				planId: null,
				planRole: null,
			})
			.returning(['User.id', 'User.email', 'User.fullName'])
			.executeTakeFirstOrThrow();

		return removedUser;
	});
}

async function cancelSubscription(
	planId: string,
	userId: string,
	stripeSubscriptionId: string,
): Promise<void> {
	await db.transaction().execute(async (tx) => {
		await tx
			.insertInto('ActivityLog')
			.values({
				action: 'cancelSubscription',
				id: id(),
				userId,
				data: JSON.stringify({
					planId,
					subscriptionId: stripeSubscriptionId,
					reason: 'user requested',
				}),
			})
			.execute();
		await stripe.subscriptions.cancel(stripeSubscriptionId);
	});
}

export async function createSubscription({
	priceLookupKey,
	stripeCustomerId,
	ctx,
}: {
	priceLookupKey: string;
	stripeCustomerId: string;
	ctx: GQLContext;
}) {
	const price =
		await ctx.dataloaders.stripePriceLookupKeyLoader.load(priceLookupKey);
	if (!price) {
		throw new BiscuitsError(BiscuitsError.Code.Unexpected, 'Price not found');
	}

	// Create the subscription. Note we're expanding the Subscription's
	// latest invoice and that invoice's payment_intent
	// so we can pass it to the front end to confirm the payment
	return stripe.subscriptions.create({
		customer: stripeCustomerId,
		items: [
			{
				price: price.id,
			},
		],
		payment_behavior: 'default_incomplete',
		payment_settings: { save_default_payment_method: 'on_subscription' },
		expand: ['latest_invoice.payment_intent'],
	});
}

export async function setupNewPlan({
	userDetails,
	priceLookupKey,
	ctx,
}: {
	userDetails: {
		id: string;
		email: string;
		fullName: string;
		stripeCustomerId: string | null;
	};
	priceLookupKey: string;
	ctx: GQLContext;
}): Promise<PlanVitalInfo> {
	const { stripeSubscription, productId, metadata, stripeCustomerId } =
		await provisionSubscription({
			userDetails,
			priceLookupKey,
			ctx,
		});

	const plan = await ctx.db.transaction().execute(async (tx) => {
		const plan = await tx
			.insertInto('Plan')
			.values({
				id: id(),
				featureFlags: {},
				name: 'New Plan',
				stripeSubscriptionId: stripeSubscription.id,
				stripePriceId: stripeSubscription.items.data[0].price.id,
				stripeProductId: productId,
				// go ahead and pre-seed this so we don't have to wait for the webhook
				subscriptionStatus: 'incomplete',
				memberLimit: metadata.memberLimit,
				allowedApp: metadata.app,
			})
			.returning(['id', 'allowedApp'])
			.executeTakeFirstOrThrow();

		await tx
			.updateTable('User')
			.set({
				planId: plan.id,
				planRole: 'admin',
				stripeCustomerId,
			})
			.where('id', '=', userDetails.id)
			.execute();

		return plan;
	});

	return plan;
}

async function provisionSubscription({
	userDetails,
	ctx,
	priceLookupKey,
}: {
	userDetails: {
		id: string;
		email: string;
		fullName: string;
		stripeCustomerId: string | null;
	};
	ctx: GQLContext;
	priceLookupKey: string;
}) {
	let stripeCustomerId = userDetails.stripeCustomerId;
	if (!stripeCustomerId) {
		// create Stripe customer to assign to user
		const stripeCustomer = await ctx.stripe.customers.create({
			email: userDetails.email,
			name: userDetails.fullName,
		});
		stripeCustomerId = stripeCustomer.id;
	}

	const stripeSubscription = await createSubscription({
		priceLookupKey,
		stripeCustomerId: stripeCustomerId,
		ctx,
	});

	const productId = stripeSubscription.items.data[0].price.product as string;
	assert(!!productId, 'Stripe subscription product ID is missing');

	const metadata = await getProductMetadata(productId);

	return { stripeSubscription, productId, metadata, stripeCustomerId };
}

export interface PlanVitalInfo {
	id: string;
	allowedApp: string | null;
}

export async function updatePlanSubscription({
	userDetails,
	priceLookupKey,
	ctx,
}: {
	userDetails: {
		id: string;
		email: string;
		fullName: string;
		stripeCustomerId: string | null;
		planId: string | null;
	};
	priceLookupKey: string;
	ctx: GQLContext;
}): Promise<PlanVitalInfo> {
	const plan = await ctx.db
		.selectFrom('Plan')
		.select(['id', 'stripeSubscriptionId', 'allowedApp'])
		.where('id', '=', userDetails.planId)
		.executeTakeFirst();

	if (!plan) {
		throw new BiscuitsError(BiscuitsError.Code.Unexpected, 'Plan not found');
	}

	// lookup the price
	const price =
		await ctx.dataloaders.stripePriceLookupKeyLoader.load(priceLookupKey);
	if (!price) {
		throw new BiscuitsError(BiscuitsError.Code.Unexpected, 'Price not found');
	}

	if (!plan.stripeSubscriptionId) {
		// we provision a new subscription
		const { stripeSubscription, productId, metadata, stripeCustomerId } =
			await provisionSubscription({
				userDetails,
				ctx,
				priceLookupKey,
			});

		const updatedPlan = await ctx.db
			.updateTable('Plan')
			.set({
				stripeSubscriptionId: stripeSubscription.id,
				stripePriceId: price.id,
				stripeProductId: productId,
				subscriptionStatus: stripeSubscription.status,
				memberLimit: metadata.memberLimit,
				allowedApp: metadata.app,
			})
			.where('id', '=', plan.id)
			.returning(['id', 'allowedApp'])
			.executeTakeFirstOrThrow();

		return updatedPlan;
	}

	const subscription = await stripe.subscriptions.retrieve(
		plan.stripeSubscriptionId,
	);

	if (!['active', 'incomplete'].includes(subscription.status)) {
		throw new BiscuitsError(
			BiscuitsError.Code.Unexpected,
			`Subscription status is ${subscription.status}. Cannot change plans.`,
		);
	}

	if (subscription.customer !== userDetails.stripeCustomerId) {
		throw new BiscuitsError(
			BiscuitsError.Code.Unexpected,
			'Your plan is administered by another member. Please ask them to change the plan.',
		);
	}

	// if the subscription already has an item, we update it
	const item = subscription.items.data[0];

	if (item.price.id === price.id) {
		// no change
		return plan;
	}

	assert(!!item.price.product, 'Subscription item product ID is missing');
	assert(typeof item.price.product === 'string', 'Product ID is not a string');

	const productMetadata = await getProductMetadata(item.price.product);

	const updatedSubscription = await stripe.subscriptions.update(
		plan.stripeSubscriptionId,
		{
			items: [
				{
					id: item.id,
					price: price.id,
				},
			],
		},
	);

	const updatedPlan = await ctx.db
		.updateTable('Plan')
		.set({
			stripePriceId: price.id,
			subscriptionStatus: updatedSubscription.status,
			memberLimit: productMetadata.memberLimit,
			allowedApp: productMetadata.app,
		})
		.where('id', '=', plan.id)
		.returningAll()
		.executeTakeFirstOrThrow();

	return updatedPlan;
}

export async function cancelPlan(
	planId: string,
	userId: string,
	ctx: GQLContext,
) {
	const plan = await db
		.selectFrom('Plan')
		.select(['id', 'stripeSubscriptionId'])
		.where('id', '=', planId)
		.executeTakeFirst();

	if (!plan) {
		throw new BiscuitsError(BiscuitsError.Code.NoPlan);
	}

	if (plan.stripeSubscriptionId) {
		await cancelSubscription(planId, userId, plan.stripeSubscriptionId);
	}

	// email plan members
	const members = await db
		.selectFrom('User')
		.select(['id', 'email', 'fullName'])
		.where('planId', '=', planId)
		.execute();

	await Promise.all(
		members.map((m) =>
			email.sendCustomEmail(
				{
					to: m.email,
					subject: 'Your Biscuits plan has been canceled',
					text: `Hi ${m.fullName},\n\nYour Biscuits plan has been canceled. If you have any questions, please contact us via
${UI_ORIGIN}/contact.\n\nThanks,\nGrant`,
					html: `<div>
        <p>Hi ${m.fullName},</p>
        <p>
          Your Biscuits plan has been canceled. If you have any questions, please contact us via
          <a href="${UI_ORIGIN}/contact">${UI_ORIGIN}/contact</a>.
        </p>
        <p>Thanks,</p>
        <p>Grant</p>
      </div>`,
				},
				ctx.reqCtx,
			),
		),
	);

	await db.transaction().execute(async (tx) => {
		await tx
			.updateTable('User')
			.set({
				planId: null,
				planRole: null,
			})
			.where('planId', '=', planId)
			.execute();

		await tx.deleteFrom('Plan').where('id', '=', planId).execute();

		await tx
			.insertInto('ActivityLog')
			.values({
				action: 'deletePlan',
				id: id(),
				userId,
				data: JSON.stringify({
					planId,
					reason: 'user requested',
				}),
			})
			.execute();
	});
}

export async function canPlanAcceptAMember(
	planId: string,
	ctx: GQLContext,
): Promise<{ ok: false; code: BiscuitsErrorCode } | { ok: true }> {
	const plan = await ctx.db
		.selectFrom('Plan')
		.select(['Plan.memberLimit', 'Plan.subscriptionStatus'])
		.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom('User')
					.select(['id', 'planRole', 'stripeCustomerId'])
					.whereRef('planId', '=', 'Plan.id'),
			).as('members'),
		])
		.where('id', '=', planId)
		.executeTakeFirst();

	if (!plan) {
		return { ok: false, code: BiscuitsErrorCode.NoPlan };
	}

	if (!isSubscribed(plan.subscriptionStatus)) {
		return { ok: false, code: BiscuitsErrorCode.SubscriptionInactive };
	}

	// unlimited
	if (plan.memberLimit === 0) {
		return { ok: true };
	}

	const memberCount = plan.members.length;
	if (memberCount >= plan.memberLimit) {
		return { ok: false, code: BiscuitsErrorCode.PlanFull };
	}

	return { ok: true };
}

export async function isPlanInGoodStanding(planId: string) {
	const plan = await db
		.selectFrom('Plan')
		.select(['subscriptionStatus'])
		.where('id', '=', planId)
		.executeTakeFirst();

	return !!plan && isSubscribed(plan.subscriptionStatus);
}
