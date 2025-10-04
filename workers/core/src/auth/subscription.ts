import Stripe from 'stripe';

export type PlanSubscriptionStatus = Stripe.Subscription.Status | 'none';

const rejectedSubscriptionStatuses: PlanSubscriptionStatus[] = [
	'canceled',
	'past_due',
	'unpaid',
	'incomplete_expired',
	'none',
];

export function isSubscribed(status: string | null | undefined) {
	if (!status) return false;
	return !rejectedSubscriptionStatuses.includes(
		status as PlanSubscriptionStatus,
	);
}
