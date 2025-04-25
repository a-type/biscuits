import { HubWishlistItem } from '@/types.js';
import { Card, clsx } from '@a-type/ui';
import { typeThemes } from '@wish-wash.biscuits/common';
import { IdeaCardContent } from './IdeaCardContent.jsx';
import { ItemCardMarquee } from './ItemCardMarquee.jsx';
import { ItemCardStar } from './ItemCardStar.jsx';
import { ProductCardContent } from './ProductCardContent.jsx';
import { VibeCardContent } from './VibeCardContent.jsx';

export interface ItemCardProps {
	item: HubWishlistItem;
	className?: string;
	listAuthor: string;
}

export function ItemCard({ item, listAuthor, className }: ItemCardProps) {
	const boughtAll = item.purchasedCount >= item.count;

	return (
		<Card
			className={clsx(
				className,
				`theme-${typeThemes[item.type]}`,
				'bg-primary-wash color-primary-ink',
				boughtAll && 'opacity-50',
			)}
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
