import { HubWishlistItem } from '@/types.js';
import { Card, clsx } from '@a-type/ui';

export interface ItemCardTitleProps {
	item: HubWishlistItem;
	className?: string;
}

export function ItemCardTitle({ item, className }: ItemCardTitleProps) {
	const hasImage = item.imageUrls.length > 0;
	return (
		<Card.Content
			unstyled
			className={clsx(
				'p-1 font-bold',
				hasImage ?
					'bg-[rgba(0,0,0,0.5)] text-[white] text-xl'
				:	'text-lg color-primary-dark',
				className,
			)}
		>
			<span>{item.description}</span>
		</Card.Content>
	);
}
