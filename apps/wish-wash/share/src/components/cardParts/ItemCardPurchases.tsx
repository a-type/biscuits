import { CardContent, clsx, Text } from '@a-type/ui';
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
	style?: React.CSSProperties;
}

export function ItemCardPurchases({
	item: itemMasked,
	className,
	style,
}: ItemCardPurchasesProps) {
	const item = readFragment(itemCardPurchasesFragment, itemMasked);
	if (!item.purchasedCount) {
		if (item.count && item.count !== Infinity && item.type !== 'vibe') {
			return (
				<CardContent className={className} style={style}>
					Wants <Text bold>{item.count}</Text>
				</CardContent>
			);
		}
		return null;
	}

	return (
		<CardContent
			className={clsx(
				item.purchasedCount >= item.count && '@mode-inverted',
				className,
			)}
			style={{
				...style,
				color: 'var(--m-gray-ink)',
			}}
		>
			<Text bold>
				{item.purchasedCount}
				{item.count ? ` / ${item.count}` : ''}
			</Text>{' '}
			bought
		</CardContent>
	);
}
