import { db, id, jsonArrayFrom } from '@biscuits/db';
import { BiscuitsError, BiscuitsErrorCode } from '@biscuits/error';
import { stripe } from '../services/stripe.js';
import { email } from '../services/email.js';
import { UI_ORIGIN } from '../config/deployedContext.js';
import { assert } from '@a-type/utils';
import { GQLContext } from '../graphql/context.js';
import { isSubscribed } from '../auth/subscription.js';

export async function removeUserFromPlan(
  planId: string,
  userId: string,
): Promise<void> {
  await db.transaction().execute(async (tx) => {
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
      console.error('User not found in plan despite select matching', {
        planId,
        userId,
      });
      throw new BiscuitsError(BiscuitsError.Code.Unexpected);
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
        await email.sendMail({
          to: newAdminDetails.email,
          subject: 'You are now the admin of your Biscuits plan',
          text: `Hi ${newAdminDetails.fullName},\n\nYou are now the admin of your Biscuits plan. You can manage your plan at ${UI_ORIGIN}/plans/${planId}.\n\nThanks,\nGrant`,
          html: `Hi ${newAdminDetails.fullName},<br><br>You are now the admin of your Biscuits plan. You can manage your plan at <a href="${UI_ORIGIN}/plans/${planId}">${UI_ORIGIN}/plans/${planId}</a>.<br><br>Thanks,<br>Grant`,
        });
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
    await tx
      .updateTable('User')
      .where('id', '=', userId)
      .set({
        planId: null,
        planRole: null,
      })
      .execute();
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

export function createSubscription({
  stripePriceId,
  stripeCustomerId,
}: {
  stripePriceId: string;
  stripeCustomerId: string;
}) {
  // Create the subscription. Note we're expanding the Subscription's
  // latest invoice and that invoice's payment_intent
  // so we can pass it to the front end to confirm the payment
  return stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [
      {
        price: stripePriceId,
      },
    ],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });
}

export async function setupNewPlan({
  userDetails,
  stripePriceId,
  ctx,
}: {
  userDetails: {
    id: string;
    email: string;
    fullName: string;
    stripeCustomerId: string | null;
  };
  stripePriceId: string;
  ctx: GQLContext;
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
    stripePriceId,
    stripeCustomerId: stripeCustomerId,
  });

  const productId = stripeSubscription.items.data[0].price.product as string;
  assert(!!productId, 'Stripe subscription product ID is missing');

  const plan = await ctx.db.transaction().execute(async (tx) => {
    const plan = await tx
      .insertInto('Plan')
      .values({
        id: id(),
        featureFlags: `{}`,
        name: 'New Plan',
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId,
        stripeProductId: productId,
      })
      .returning('id')
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

export async function updatePlanSubscription({
  userDetails,
  stripePriceId,
  ctx,
}: {
  userDetails: {
    id: string;
    email: string;
    fullName: string;
    stripeCustomerId: string | null;
    planId: string | null;
  };
  stripePriceId: string;
  ctx: GQLContext;
}) {
  const plan = await ctx.db
    .selectFrom('Plan')
    .select(['id', 'stripeSubscriptionId'])
    .where('id', '=', userDetails.planId)
    .executeTakeFirst();

  if (!plan) {
    throw new BiscuitsError(BiscuitsError.Code.Unexpected, 'Plan not found');
  }

  if (!plan.stripeSubscriptionId) {
    // we provision a new subscription
    return setupNewPlan({ userDetails, stripePriceId, ctx });
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

  await stripe.subscriptions.update(plan.stripeSubscriptionId, {
    items: [
      {
        id: plan.stripeSubscriptionId,
        price: stripePriceId,
      },
    ],
  });

  return plan;
}

export async function cancelPlan(planId: string, userId: string) {
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
      email.sendMail({
        to: m.email,
        subject: 'Your Biscuits plan has been canceled',
        text: `Hi ${m.fullName},\n\nYour Biscuits plan has been canceled. If you have any questions, please contact us at
${UI_ORIGIN}/contact.\n\nThanks,\nGrant`,
        html: `Hi ${m.fullName},<br><br>Your Biscuits plan has been canceled. If you have any questions, please contact us at
<a href="${UI_ORIGIN}/contact">${UI_ORIGIN}/contact</a>.<br><br>Thanks,<br>Grant`,
      }),
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
