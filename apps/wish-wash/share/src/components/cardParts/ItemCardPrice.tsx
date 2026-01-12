import { Card } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardPriceFragment = graphql(`
	fragment ItemCardPrice on PublishedWishlistItem {
		id
		priceMin
		priceMax
	}
`);

export interface ItemCardPriceProps {
	item: FragmentOf<typeof itemCardPriceFragment>;
	className?: string;
}

export function ItemCardPrice({
	item: itemMasked,
	className,
}: ItemCardPriceProps) {
	const item = readFragment(itemCardPriceFragment, itemMasked);
	const priceDisplay =
		item.priceMin && item.priceMax ?
			`${item.priceMin} - ${item.priceMax}`
		:	(item.priceMin ?? item.priceMax);

	if (!priceDisplay) {
		return null;
	}

	return (
		<Card.Content className={className}>
			<span className="text-md">{priceDisplay}</span>
		</Card.Content>
	);
}
