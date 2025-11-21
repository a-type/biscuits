import { Box, Button, ButtonProps, Icon } from '@a-type/ui';
import { usePurchaseItem, useUnpurchaseItem } from '~/hooks.js';
import { useLocalPurchase } from '~/utils/localPurchases.js';

export interface ItemCardPurchaseButtonProps extends ButtonProps {
	itemId: string;
}

export function ItemCardPurchaseButton({
	itemId,
	...props
}: ItemCardPurchaseButtonProps) {
	const [localPurchaseId] = useLocalPurchase(itemId);
	const [purchaseItem, { isPending: loading }] = usePurchaseItem(itemId);
	const [unpurchaseItem, { isPending: unpurchaseLoading }] =
		useUnpurchaseItem(itemId);

	if (localPurchaseId) {
		return (
			<Box
				surface
				items="center"
				color="success"
				rounded
				gap="sm"
				className="text-xs pl-md h-touch"
			>
				<Icon name="check" />
				<span>You bought it!</span>
				{typeof localPurchaseId === 'string' ?
					<Button
						size="small"
						loading={unpurchaseLoading}
						color="attention"
						emphasis="light"
						onClick={() => unpurchaseItem()}
					>
						<Icon name="undo" />
					</Button>
				:	<div className="w-3" />}
			</Box>
		);
	}

	return (
		<Button
			size="small"
			color="accent"
			emphasis="default"
			toggleMode="indicator"
			{...props}
			onClick={() =>
				purchaseItem({
					quantity: 1,
					name: '',
				})
			}
			loading={loading}
		>
			I bought this
		</Button>
	);
}
