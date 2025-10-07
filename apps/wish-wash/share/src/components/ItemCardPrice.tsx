import { HubWishlistItem } from '@/types.js';
import { Card } from '@a-type/ui';

export interface ItemCardPriceProps {
	item: HubWishlistItem;
	className?: string;
}

export function ItemCardPrice({ item, className }: ItemCardPriceProps) {
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
