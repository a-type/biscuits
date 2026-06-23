import { Box, Button, H2, P } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import {
	Elements,
	PaymentElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import { type Stripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

export const checkoutData = graphql(`
	fragment SubscriptionCheckout_checkoutData on StripeCheckoutData {
		subscriptionId
		clientSecret
		mode
	}
`);

export interface SubscriptionCheckoutProps {
	checkoutData: FragmentOf<typeof checkoutData>;
}

export function SubscriptionCheckout({
	checkoutData: $checkoutData,
}: SubscriptionCheckoutProps) {
	const [stripe, setStripe] = useState<Stripe | null>(null);
	useEffect(() => {
		import('@stripe/stripe-js').then((module) => {
			module
				.loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)
				.then((stripeInstance) => {
					setStripe(stripeInstance);
				});
		});
	}, []);
	const data = readFragment(checkoutData, $checkoutData);

	if (!stripe) {
		return <div>Loading payment gateway...</div>;
	}

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
			<PaymentForm mode={data.mode} />
		</Elements>
	);
}

export default SubscriptionCheckout;

function PaymentForm({ mode }: { mode: string }) {
	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState<string | null>(null);

	const submit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!stripe || !elements) {
			console.error('Stripe failed to load');
			return;
		}

		if (mode === 'setup') {
			const result = await stripe.confirmSetup({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/settings?tab=subscription&paymentComplete=true`,
				},
			});

			if (result.error) {
				console.error('Stripe failed to confirm setup', result.error);
				setError(
					result.error.message ?? 'An unexpected error occurred. Try again?',
				);
				return;
			}
		} else {
			const result = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/settings?tab=subscription&paymentComplete=true`,
				},
			});

			if (result.error) {
				console.error('Stripe failed to confirm payment', result.error);
				setError(
					result.error.message ?? 'An unexpected error occurred. Try again?',
				);
				return;
			}
		}
	};

	return (
		<Box render={<form onSubmit={submit} />} gap col>
			<H2>Complete your subscription</H2>
			<PaymentElement />
			{error && (
				<Box surface="secondary" color="attention">
					<P>{error}</P>
				</Box>
			)}
			<Button
				emphasis="primary"
				disabled={!stripe}
				type="submit"
				style={{ alignSelf: 'end' }}
			>
				Subscribe
			</Button>
		</Box>
	);
}
