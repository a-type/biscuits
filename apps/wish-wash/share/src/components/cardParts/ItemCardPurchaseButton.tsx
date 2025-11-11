import { Button, ButtonProps } from '@a-type/ui';
import { usePurchaseItem } from '~/hooks.js';
import { useLocalPurchase } from '~/utils/localPurchases.js';

export interface ItemCardPurchaseButtonProps extends ButtonProps {
	itemId: string;
}

export function ItemCardPurchaseButton({
	itemId,
	...props
}: ItemCardPurchaseButtonProps) {
	const [hasPurchased] = useLocalPurchase(itemId);
	const [purchaseItem, { isPending: loading }] = usePurchaseItem(itemId);

	return (
		<Button
			size="small"
			color="accent"
			emphasis={hasPurchased ? 'primary' : 'default'}
			toggleMode="indicator"
			{...props}
			toggled={hasPurchased}
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
