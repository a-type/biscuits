import { db } from '@biscuits/db';
import { Session } from '../auth/session.js';
import Stripe from 'stripe';

export enum Message {
  NoAccount = 'No account found',
  NoPlan = 'No plan found',
  NoSubscription = 'No subscription found',
  PlanChanged = 'Plan changed',
}

export class SubscriptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SubscriptionError';
  }
}

export async function getSubscriptionStatus(session: Session) {
  return await getSubscriptionStatusError(session);
}

export async function verifySubscription(session: Session) {
  const status = await getSubscriptionStatusError(session);
  if (status) {
    throw new SubscriptionError(status);
  }
}

/**
 * WARNING: mutates session, because I'm lazy.
 */
export async function getSubscriptionStatusError(session: Session) {
  const profileAndPlan = await db
    .selectFrom('Profile')
    .where('id', '=', session.userId)
    .leftJoin('Plan', 'Plan.id', 'Profile.planId')
    .select([
      'Profile.id as profileId',
      'Profile.friendlyName',
      'Profile.isProductAdmin',
      'Profile.planRole',
      'Plan.id as planId',
      'Plan.name as planName',
      'Plan.subscriptionStatus',
      'Plan.stripeSubscriptionId',
    ])
    .executeTakeFirst();

  if (!profileAndPlan) {
    return Message.NoAccount;
  }

  if (profileAndPlan.planId !== session.planId) {
    // the user's plan has changed, so we need to refresh the session
    return Message.PlanChanged;
  }

  if (!profileAndPlan.planId) {
    return Message.NoPlan;
  }
  if (!profileAndPlan.stripeSubscriptionId) {
    return Message.NoSubscription;
  }
  if (
    !profileAndPlan.subscriptionStatus ||
    rejectedSubscriptionStatuses.includes(
      profileAndPlan.subscriptionStatus as Stripe.Subscription.Status,
    )
  ) {
    return Message.NoSubscription;
  }

  // no error? update session
  session.role = profileAndPlan.planRole as 'admin' | 'user';
  session.planId = profileAndPlan.planId;
  session.name = profileAndPlan.friendlyName;
  session.isProductAdmin = profileAndPlan.isProductAdmin;
}

const rejectedSubscriptionStatuses: Stripe.Subscription.Status[] = [
  'canceled',
  'past_due',
  'unpaid',
  'incomplete_expired',
];

export async function isSubscribed(session: Session | null | undefined) {
  if (!session?.planId) return false;
  const plan = await db
    .selectFrom('Plan')
    .where('id', '=', session.planId)
    .select(['subscriptionStatus'])
    .executeTakeFirst();
  return (
    plan?.subscriptionStatus === 'active' ||
    plan?.subscriptionStatus === 'trialing'
  );
}
