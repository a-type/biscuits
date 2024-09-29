import React from 'react';
import { HubWishlistItem } from '@/types.js';
import { Card } from '@a-type/ui/components/card';

export interface ItemCardTitleProps {
	item: HubWishlistItem;
	className?: string;
}

export function ItemCardTitle({ item, className }: ItemCardTitleProps) {
	const hasImage = item.imageUrls.length > 0;
	return (
		<Card.Content unstyled={!hasImage} className={className}>
			<span className="text-lg font-bold">{item.description}</span>
		</Card.Content>
	);
}
