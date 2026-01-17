import { clsx, Icon } from '@a-type/ui';
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
			className={clsx(
				'h-20px w-20px',
				'absolute right-md top-md z-1',
				'fill-primary',
				className,
			)}
		/>
	);
}
