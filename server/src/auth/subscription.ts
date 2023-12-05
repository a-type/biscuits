import { Session } from '../auth/session.js';
import { prisma } from '../data/prisma.js';
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
  const profileAndPlan = await prisma.profile.findUnique({
    where: { id: session.userId },
    include: {
      plan: true,
    },
  });

  if (!profileAndPlan) {
    return Message.NoAccount;
  }

  const plan = profileAndPlan.plan;

  if (plan.id !== session.planId) {
    // the user's plan has changed, so we need to refresh the session
    return Message.PlanChanged;
  }

  if (!plan) {
    return Message.NoPlan;
  }
  if (!plan.stripeSubscriptionId) {
    return Message.NoSubscription;
  }
  if (
    !plan.subscriptionStatus ||
    rejectedSubscriptionStatuses.includes(
      plan.subscriptionStatus as Stripe.Subscription.Status,
    )
  ) {
    return Message.NoSubscription;
  }

  // no error? update session
  session.role = profileAndPlan.role as 'admin' | 'user';
  session.planId = plan.id;
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
  const plan = await prisma.plan.findUnique({
    where: { id: session.planId },
  });
  return (
    plan?.subscriptionStatus === 'active' ||
    plan?.subscriptionStatus === 'trialing'
  );
}
