import { graphql } from '@biscuits/graphql';
import { ConfirmedButton } from '@a-type/ui/components/button';
import { useNavigate } from '@verdant-web/react-router';
import { useMutation } from '@apollo/client';

const cancelPlan = graphql(`
	mutation CancelPlan {
		cancelPlan {
			user {
				id
				plan {
					id
				}
			}
		}
	}
`);

export interface CancelPlanButtonProps {}

export function CancelPlanButton({}: CancelPlanButtonProps) {
	const [cancel] = useMutation(cancelPlan);
	const navigate = useNavigate();
	return (
		<div>
			<ConfirmedButton
				color="destructive"
				confirmTitle="Are you sure you want to cancel?"
				confirmAction="I'm sure"
				confirmText="Your data will all still be there on your device, but you won't be able to sync to other devices, with other plan members, or access member-only features anymore. You can come back anytime."
				onConfirm={async () => {
					await cancel();
					navigate('/');
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
