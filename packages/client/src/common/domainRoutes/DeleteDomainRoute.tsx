import { ConfirmedButton, ConfirmedButtonProps, toast } from '@a-type/ui';
import { graphql, useMutation } from '@biscuits/graphql';

export interface DeleteDomainRouteProps extends Partial<ConfirmedButtonProps> {
	domainRouteId: string;
	onDelete?: () => void;
}

const deleteDomainMutation = graphql(`
	mutation DeleteDomainRoute($id: ID!) {
		deleteDomainRoute(id: $id)
	}
`);

export function DeleteDomainRoute({
	domainRouteId,
	onDelete,
	...rest
}: DeleteDomainRouteProps) {
	const [mutate] = useMutation(deleteDomainMutation, {
		variables: {
			id: domainRouteId,
		},
		onCompleted: () => {
			onDelete?.();
			toast.success('Domain removed');
		},
	});
	return (
		<ConfirmedButton
			emphasis="primary"
			confirmText="Remember to remove your DNS entries for this domain to completely disconnect it."
			confirmAction="Remove my domain"
			confirmColor="primary"
			color="attention"
			{...rest}
			onConfirm={async () => {
				await mutate();
			}}
		>
			Delete custom domain
		</ConfirmedButton>
	);
}
