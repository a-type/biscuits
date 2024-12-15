import { Button, H2 } from '@a-type/ui';
import {
	Elements,
	PaymentElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { FragmentOf, graphql, readFragment } from '../../graphql.js';
import { stripe } from '../../stripe.js';

export const checkoutData = graphql(`
	fragment SubscriptionCheckout_checkoutData on StripeCheckoutData {
		subscriptionId
		clientSecret
	}
`);

export interface SubscriptionCheckoutProps {
	checkoutData: FragmentOf<typeof checkoutData>;
}

export function SubscriptionCheckout({
	checkoutData: $checkoutData,
}: SubscriptionCheckoutProps) {
	const data = readFragment(checkoutData, $checkoutData);

	return (
		<Elements
			stripe={stripe}
			options={{
				clientSecret: data.clientSecret,
				appearance: {
					theme: 'flat',
					variables: {
						colorPrimary: '#ffe17c',
						colorBackground: '#f5f5f5',
					},
				},
			}}
		>
			<PaymentForm />
		</Elements>
	);
}

function PaymentForm() {
	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState<string | null>(null);

	const submit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!stripe || !elements) {
			console.error('Stripe failed to load');
			return;
		}

		const result = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/settings?paymentComplete=true`,
			},
		});

		if (result.error) {
			console.error('Stripe failed to confirm payment', result.error);
			setError(
				result.error.message ?? 'An unexpected error occurred. Try again?',
			);
			return;
		}
	};

	return (
		<form onSubmit={submit} className="flex flex-col gap-4">
			<H2>Complete your subscription</H2>
			<PaymentElement />
			{error && <p className="text-red">{error}</p>}
			<Button
				color="primary"
				disabled={!stripe}
				type="submit"
				className="self-end"
			>
				Subscribe
			</Button>
		</form>
	);
}
