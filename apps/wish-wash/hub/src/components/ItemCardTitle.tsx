import { HubWishlistItem } from '@/types.js';
import { Card } from '@a-type/ui/components/card';
import { Chip } from '@a-type/ui/components/chip';
import { Icon } from '@a-type/ui/components/icon';
import { typeIcons } from '@wish-wash.biscuits/common';
import { clsx } from '@a-type/ui';

export interface ItemCardTitleProps {
	item: HubWishlistItem;
	className?: string;
}

export function ItemCardTitle({ item, className }: ItemCardTitleProps) {
	const hasImage = item.imageUrls.length > 0;
	return (
		<>
			<Card.Content unstyled className="pt-2 pl-1">
				<Chip color="primary" className="inline-flex">
					<Icon name={typeIcons[item.type]} />
					{item.type}
				</Chip>
			</Card.Content>
			<Card.Content
				unstyled
				className={clsx(
					'p-1 font-bold',
					hasImage ?
						'bg-[rgba(0,0,0,0.5)] text-[white] text-xl'
					:	'text-lg color-primary-dark',
				)}
			>
				<span>{item.description}</span>
			</Card.Content>
		</>
	);
}
