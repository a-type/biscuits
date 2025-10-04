import Stripe from 'stripe';

export const getStripe = (key: string) =>
	new Stripe(key, {
		apiVersion: '2023-10-16',
	});

export function stripeDateToDate(
	stripeDate: number | undefined | null,
): Date | undefined {
	if (stripeDate === undefined || stripeDate === null) {
		return undefined;
	}
	return new Date(stripeDate * 1000);
}
