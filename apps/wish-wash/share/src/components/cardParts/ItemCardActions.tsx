import { Card } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { ItemCardPurchaseButton } from './ItemCardPurchaseButton.js';

export const itemCardActionsFragment = graphql(`
	fragment ItemCardActions on PublicWishlistItem {
		id
	}
`);

export function ItemCardActions({
	item: itemMasked,
	className,
}: {
	item: FragmentOf<typeof itemCardActionsFragment>;
	className?: string;
}) {
	const item = readFragment(itemCardActionsFragment, itemMasked);
	return (
		<Card.Actions className={className}>
			<ItemCardPurchaseButton itemId={item.id} />
		</Card.Actions>
	);
}
