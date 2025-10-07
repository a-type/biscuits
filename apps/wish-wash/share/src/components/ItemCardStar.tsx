import { HubWishlistItem } from '@/types.js';
import { clsx, Icon } from '@a-type/ui';

export interface ItemCardStarProps {
	item: HubWishlistItem;
	className?: string;
}

export function ItemCardStar({ item, className }: ItemCardStarProps) {
	if (!item.prioritized) return null;
	return (
		<Icon
			name="star"
			className={clsx(
				'w-20px h-20px',
				'absolute right-md top-md z-1',
				'fill-primary',
				className,
			)}
		/>
	);
}
