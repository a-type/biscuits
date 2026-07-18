import { Icon } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardStarFragment = graphql(`
	fragment ItemCardStar on PublishedWishlistItem {
		id
		prioritized
	}
`);

export interface ItemCardStarProps {
	item: FragmentOf<typeof itemCardStarFragment>;
	className?: string;
}

export function ItemCardStar({
	item: itemMasked,
	className,
}: ItemCardStarProps) {
	const item = readFragment(itemCardStarFragment, itemMasked);
	if (!item.prioritized) return null;
	return (
		<Icon
			name="star"
			size={20}
			style={{
				position: 'absolute',
				right: 'var(--m-sp-md)',
				top: 'var(--m-sp-md)',
				zIndex: 1,
			}}
			filled
			className={className}
		/>
	);
}
