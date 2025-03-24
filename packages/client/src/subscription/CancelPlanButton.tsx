import { ConfirmedButton } from '@a-type/ui';
import { graphql, useMutation } from '@biscuits/graphql';
import { manageSubscriptionInfo } from './ManageSubscription.js';
import { checkoutData } from './SubscriptionCheckout.js';

const cancelPlan = graphql(
	`
		mutation CancelPlan {
			cancelPlan {
				user {
					id
					plan {
						id
						subscriptionStatus
						isSubscribed
						checkoutData {
							...SubscriptionCheckout_checkoutData
						}
						...ManageSubscription_manageSubscriptionInfo
					}
				}
			}
		}
	`,
	[checkoutData, manageSubscriptionInfo],
);

export interface CancelPlanButtonProps {}

export function CancelPlanButton({}: CancelPlanButtonProps) {
	const [cancel] = useMutation(cancelPlan);
	return (
		<div>
			<ConfirmedButton
				color="destructive"
				confirmTitle="Are you sure you want to cancel?"
				confirmAction="I'm sure"
				confirmText="Your data will all still be there on your device, but you won't be able to sync to other devices, with other plan members, or access member-only features anymore. You can come back anytime."
				onConfirm={async () => {
					await cancel();
				}}
			>
				Cancel your plan
			</ConfirmedButton>
			<span className="text-xs">
				Keep your data, but lose access to member-only features, including
				device sync and sharing.
			</span>
		</div>
	);
}
