import { ButtonProps, ConfirmedButton } from '@a-type/ui';
import { graphql, useMutation } from '@biscuits/graphql';

const leavePlanMutation = graphql(`
	mutation LeavePlan {
		leavePlan {
			me {
				plan {
					id
				}
			}
		}
	}
`);

export interface LeavePlanButtonProps extends ButtonProps {}

export function LeavePlanButton({ children, ...props }: LeavePlanButtonProps) {
	const [mutate, { loading }] = useMutation(leavePlanMutation, {
		onCompleted: () => {
			window.location.reload();
		},
	});

	return (
		<ConfirmedButton
			color="destructive"
			{...props}
			loading={loading}
			confirmText="Are you sure you want to leave your plan? Your devices will stop syncing and you will lose access to subscriber features."
			confirmAction="Leave"
			confirmTitle="Leave Plan"
			onConfirm={() => mutate()}
		>
			{children || 'Leave Plan'}
		</ConfirmedButton>
	);
}
