import { CardGrid } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { useShowPurchased } from '~/hooks.js';
import { ItemCard, itemCardFragment } from './ItemCard.js';

export const itemsFragment = graphql(
	`
		fragment Items on PublishedWishlistItem {
			id
			purchasedCount
			count
			...ItemCard
		}
	`,
	[itemCardFragment],
);

export interface ItemsProps {
	items: FragmentOf<typeof itemsFragment>[];
	listAuthor: string;
	className?: string;
}

export function Items({
	items: itemsMasked,
	listAuthor,
	className,
}: ItemsProps) {
	const items = itemsMasked.map((item) => readFragment(itemsFragment, item));

	const unpurchasedItems = items.filter(
		(item) => item.purchasedCount < (item.count || Infinity),
	);
	const purchasedItems = items.filter(
		(item) => item.purchasedCount >= (item.count || Infinity),
	);

	const [showPurchased] = useShowPurchased();

	return (
		<CardGrid
			className={className}
			columns={(w) => {
				if (w < 600) return 2;
				if (w < 800) return 3;
				if (w < 1000) return 4;
				return 5;
			}}
		>
			{unpurchasedItems.map((item) => (
				<ItemCard key={item.id} item={item} listAuthor={listAuthor} />
			))}
			{showPurchased &&
				purchasedItems.map((item) => (
					<ItemCard key={item.id} item={item} listAuthor={listAuthor} />
				))}
		</CardGrid>
	);
}
