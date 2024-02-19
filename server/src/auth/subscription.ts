import Stripe from 'stripe';

const rejectedSubscriptionStatuses: Stripe.Subscription.Status[] = [
  'canceled',
  'past_due',
  'unpaid',
  'incomplete_expired',
];

export function isSubscribed(status: string | null | undefined) {
  if (!status) return false;
  return !rejectedSubscriptionStatuses.includes(
    status as Stripe.Subscription.Status,
  );
}
