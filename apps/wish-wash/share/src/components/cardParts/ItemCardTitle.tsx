import { Card } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardTitleFragment = graphql(`
	fragment ItemCardTitle on PublishedWishlistItem {
		id
		imageUrls
		description
		prioritized
	}
`);

export interface ItemCardTitleProps {
	item: FragmentOf<typeof itemCardTitleFragment>;
	className?: string;
}

export function ItemCardTitle({
	item: itemMasked,
	className,
}: ItemCardTitleProps) {
	const item = readFragment(itemCardTitleFragment, itemMasked);
	return (
		<Card.Title className={className}>
			<span>{item.description}</span>
		</Card.Title>
	);
}
