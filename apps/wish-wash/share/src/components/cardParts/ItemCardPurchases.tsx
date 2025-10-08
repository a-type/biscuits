import { CardContent, clsx } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardPurchasesFragment = graphql(`
	fragment ItemCardPurchases on PublicWishlistItem {
		id
		count
		purchasedCount
	}
`);

export interface ItemCardPurchasesProps {
	item: FragmentOf<typeof itemCardPurchasesFragment>;
	className?: string;
}

export function ItemCardPurchases({
	item: itemMasked,
	className,
}: ItemCardPurchasesProps) {
	const item = readFragment(itemCardPurchasesFragment, itemMasked);
	if (!item.purchasedCount) return null;

	return (
		<CardContent
			className={clsx(
				'text-sm block items-center bg-white color-black',
				className,
			)}
		>
			<strong>
				{item.purchasedCount}
				{item.count ? ` / ${item.count}` : ''}
			</strong>{' '}
			bought already
		</CardContent>
	);
}
