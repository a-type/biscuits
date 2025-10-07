import { HubWishlistItem } from '@/types.js';
import { Card, clsx } from '@a-type/ui';
import { typeThemes } from '@wish-wash.biscuits/common';
import { IdeaCardContent } from './IdeaCardContent.js';
import { ItemCardMarquee } from './ItemCardMarquee.js';
import { ItemCardStar } from './ItemCardStar.js';
import { ProductCardContent } from './ProductCardContent.js';
import { VibeCardContent } from './VibeCardContent.js';

export interface ItemCardProps {
	item: HubWishlistItem;
	className?: string;
	listAuthor: string;
}

export function ItemCard({ item, listAuthor, className }: ItemCardProps) {
	const boughtAll = item.count > 0 && item.purchasedCount >= item.count;

	return (
		<Card
			className={clsx(
				className,
				`theme-${typeThemes[item.type]}`,
				'bg-primary-wash color-primary-ink',
				boughtAll && 'opacity-50',
				item.prioritized && !boughtAll && 'min-h-200px sm:min-h-250px',
			)}
			data-span={item.prioritized && !boughtAll ? 2 : 1}
		>
			<ItemCardStar item={item} />
			<ItemCardMarquee item={item} />
			<ItemCardContent item={item} listAuthor={listAuthor} />
		</Card>
	);
}

function ItemCardContent({ item, ...rest }: ItemCardProps) {
	switch (item.type) {
		case 'link':
			return <ProductCardContent item={item} {...rest} />;
		case 'idea':
			return <IdeaCardContent item={item} {...rest} />;
		case 'vibe':
			return <VibeCardContent item={item} {...rest} />;
	}

	return null;
}
