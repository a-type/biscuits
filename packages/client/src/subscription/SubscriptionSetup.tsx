import { Box, P, Spinner } from '@a-type/ui';
import { graphql, useQuery } from '@biscuits/graphql';
import { useSearchParams } from '@verdant-web/react-router';
import { lazy, Suspense, useEffect } from 'react';
import {
	ManageSubscription,
	manageSubscriptionInfo,
} from './ManageSubscription.js';
import { checkoutData } from './SubscriptionCheckout.js';
import { PriceKey, SubscriptionSelect } from './SubscriptionSelect.js';

const SubscriptionCheckout = lazy(() => import('./SubscriptionCheckout.js'));

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
				subscriptionCanceledAt
				trialEndsAt
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

	if (data?.plan) {
		if (data?.plan?.checkoutData) {
			// checkout in progress - show payment collection
			return (
				<Box d="col" gap>
					<Suspense fallback={<Spinner />}>
						{data.plan.subscriptionStatus === 'trialing' && (
							<Box surface="accent" p d="col">
								<P>
									Your trial subscription period has begun! Billing will begin
									on {new Date(data.plan.trialEndsAt || 0).toLocaleDateString()}
									. You can cancel any time before then to avoid payment. We'll
									send you a reminder email one week before.
								</P>
								<P>
									You can enter your payment information below now if you'd like
									to ensure no hiccups. You still won't be billed until the
									trial ends.
								</P>
							</Box>
						)}
						<SubscriptionCheckout checkoutData={data.plan.checkoutData} />
						<ManageSubscription data={data.plan} />
					</Suspense>
				</Box>
			);
		}

		if (data?.plan?.subscriptionStatus === 'incomplete') {
			// if there wasn't any checkoutData, that means we're in limbo.
			return <ManageSubscription data={data.plan} />;
		}

		if (data?.plan?.subscriptionStatus === 'trialing') {
			return (
				<Box d="col" gap>
					<Box surface="accent" p>
						Your trial subscription period has begun! Billing will begin on{' '}
						{new Date(data.plan.trialEndsAt || 0).toLocaleDateString()}. You can
						cancel any time before then to avoid payment. We'll send you a
						reminder email one week before.
					</Box>
					<ManageSubscription data={data.plan} />
				</Box>
			);
		}

		if (
			data?.plan?.subscriptionStatus === 'active' ||
			data?.plan?.subscriptionStatus === 'trialing'
		) {
			// subscription active - show management
			return <ManageSubscription data={data.plan} />;
		}

		if (data?.plan?.subscriptionStatus === 'canceled') {
			return (
				<Box d="col" gap>
					<Box surface="primary">
						Your subscription was canceled on{' '}
						{new Date(
							data.plan.subscriptionCanceledAt ?? Date.now(),
						).toLocaleDateString()}
						. You can restart it by selecting a plan below.
					</Box>
					<SubscriptionSelect priceKeys={priceKeys} />
				</Box>
			);
		}
	}

	// subscription inactive - show plan selection
	return (
		<div className="flex flex-col gap-3">
			<P>
				You don't have an active subscription. Subscribe to unlock all Biscuits
				app features.
			</P>
			<SubscriptionSelect priceKeys={priceKeys} />
		</div>
	);
}
