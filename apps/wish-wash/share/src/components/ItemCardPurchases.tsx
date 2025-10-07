import { HubWishlistItem } from '@/types.js';
import { CardContent, clsx } from '@a-type/ui';

export interface ItemCardPurchasesProps {
	item: HubWishlistItem;
	className?: string;
}

export function ItemCardPurchases({ item, className }: ItemCardPurchasesProps) {
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
