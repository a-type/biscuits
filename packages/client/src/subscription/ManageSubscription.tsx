import { Box, Button, Chip, clsx, H2, Icon, toast } from '@a-type/ui';
import {
	FragmentOf,
	graphql,
	readFragment,
	useLazyQuery,
} from '@biscuits/graphql';
import { useSearchParams } from '@verdant-web/react-router';
import { useEffect } from 'react';
import * as CONFIG from '../config.js';
import { CancelPlanButton } from './CancelPlanButton.js';
import { LeavePlanButton } from './LeavePlanButton.js';
import { PlanInfo, planProductInfo } from './PlanInfo.js';

export const manageSubscriptionInfo = graphql(
	`
		fragment ManageSubscription_manageSubscriptionInfo on Plan {
			id
			subscriptionStatus
			userIsAdmin
			productInfo {
				id
				...PlanInfo_productInfo
			}
		}
	`,
	[planProductInfo],
);

const refetchPlanStatus = graphql(`
	query RefetchPlanStatus {
		plan {
			id
			subscriptionStatus
		}
	}
`);

export interface ManageSubscriptionProps {
	className?: string;
	data: FragmentOf<typeof manageSubscriptionInfo>;
}

export function ManageSubscription({
	className,
	data: $data,
	...props
}: ManageSubscriptionProps) {
	const [params, setParams] = useSearchParams();

	const data = readFragment(manageSubscriptionInfo, $data);

	useEffect(() => {
		if (params.get('paymentComplete')) {
			toast.success('Your subscription is activated! 🎉');
			setParams((p) => {
				p.delete('paymentComplete');
				return p;
			});
		}
	}, [params, setParams]);

	const [refetchStatus] = useLazyQuery(refetchPlanStatus);

	return (
		<div
			className={clsx('flex flex-col gap-4 items-start', className)}
			{...props}
		>
			<div className="flex flex-col gap-4 w-full">
				<div className="row justify-between w-full">
					<H2>Your Subscription</H2>
					<Chip
						color={
							data.subscriptionStatus === 'active' ? 'accent'
							: data.subscriptionStatus === 'trialing' ?
								'primary'
							:	'gray'
						}
						className="pl-6"
					>
						{data.subscriptionStatus}
						<Button
							emphasis="ghost"
							onClick={() => {
								refetchStatus({ fetchPolicy: 'network-only' });
							}}
						>
							<Icon name="refresh" />
						</Button>
					</Chip>
				</div>
				{data.productInfo && <PlanInfo data={data.productInfo} />}
			</div>
			{data.userIsAdmin ?
				<>
					<form
						action={`${CONFIG.API_ORIGIN}/stripe/portal-session`}
						method="POST"
					>
						<Button type="submit">Change your subscription</Button>
						<span className="text-xs">
							Update your plan, change your card, or unsubscribe
						</span>
					</form>
					<CancelPlanButton />
				</>
			:	<Box d="col" gap items="start">
					Someone else manages your subscription. Reach out to them to make
					changes.
					<LeavePlanButton />
				</Box>
			}
		</div>
	);
}
