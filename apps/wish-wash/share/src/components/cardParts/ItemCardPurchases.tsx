import { CardContent, clsx } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardPurchasesFragment = graphql(`
	fragment ItemCardPurchases on PublishedWishlistItem {
		id
		count
		purchasedCount
		type
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
	if (!item.purchasedCount) {
		if (item.count && item.count !== Infinity && item.type !== 'vibe') {
			return (
				<CardContent className={clsx('text-sm block items-center', className)}>
					Wants <strong>{item.count}</strong>
				</CardContent>
			);
		}
		return null;
	}

	return (
		<CardContent
			className={clsx(
				'text-sm block items-center',
				item.purchasedCount >= item.count ?
					'bg-main-dark color-contrast'
				:	'bg-white',
				className,
			)}
		>
			<strong>
				{item.purchasedCount}
				{item.count ? ` / ${item.count}` : ''}
			</strong>{' '}
			bought
		</CardContent>
	);
}
