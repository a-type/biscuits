import { graphql, useQuery } from '@biscuits/graphql';
import { Spinner } from '@a-type/ui/components/spinner';
import {
	ManageSubscription,
	manageSubscriptionInfo,
} from './ManageSubscription.js';
import { checkoutData, SubscriptionCheckout } from './SubscriptionCheckout.js';
import { PriceKey, SubscriptionSelect } from './SubscriptionSelect.js';
import { useSearchParams } from '@verdant-web/react-router';
import { useEffect } from 'react';

export interface SubscriptionSetupProps {
	priceKeys?: PriceKey[];
}

const PlanSubscriptionInfo = graphql(
	`
		query PlanSubscriptionInfo {
			plan {
				id
				subscriptionStatus
				checkoutData {
					...SubscriptionCheckout_checkoutData
				}
				...ManageSubscription_manageSubscriptionInfo
			}
		}
	`,
	[checkoutData, manageSubscriptionInfo],
);

const TERMINAL_STATUSES = [
	'active',
	'canceled',
	'incomplete_expired',
	'trialing',
	'paused',
	'past_due',
];

export function SubscriptionSetup({ priceKeys }: SubscriptionSetupProps) {
	const [params, setParams] = useSearchParams();
	const didJustCheckout = params.get('paymentComplete');

	const { data, refetch, loading } = useQuery(PlanSubscriptionInfo);

	const subscriptionStatus = data?.plan?.subscriptionStatus;
	const isTerminalStatus =
		subscriptionStatus && TERMINAL_STATUSES.includes(subscriptionStatus);

	// wait and poll for change in plan status to indicate subscription
	// was successful.
	useEffect(() => {
		if (didJustCheckout) {
			if (isTerminalStatus) {
				setParams((p) => {
					p.delete('paymentComplete');
					return p;
				});
			} else {
				let checkCount = 0;
				const interval = setInterval(async () => {
					// check for subscription status change
					refetch({ requestPolicy: 'network-only' });
					checkCount++;
					if (checkCount > 10) {
						clearInterval(interval);
						setParams((p) => {
							p.delete('paymentComplete');
							return p;
						});
					}
				}, 5000);
				return () => clearInterval(interval);
			}
		}
	}, [didJustCheckout, refetch, isTerminalStatus, setParams]);

	if (didJustCheckout) {
		return (
			<div>
				<Spinner />
				<div>Activating your subscription...</div>
			</div>
		);
	}

	if (loading) {
		return <Spinner />;
	}

	if (data?.plan?.checkoutData) {
		// checkout in progress - show payment collection
		return <SubscriptionCheckout checkoutData={data.plan.checkoutData} />;
	}

	if (data?.plan?.subscriptionStatus === 'incomplete') {
		// if there wasn't any checkoutData, that means we're in limbo.
		return <ManageSubscription data={data.plan} />;
	}

	if (data?.plan?.subscriptionStatus === 'active') {
		// subscription active - show management
		return <ManageSubscription data={data.plan} />;
	}

	// subscription inactive - show plan selection
	return <SubscriptionSelect priceKeys={priceKeys} />;
}
