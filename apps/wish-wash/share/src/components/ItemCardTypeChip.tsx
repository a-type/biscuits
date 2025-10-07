import { HubWishlistItem } from '@/types.js';
import { Card, Chip, clsx, Icon } from '@a-type/ui';
import { typeIcons } from '@wish-wash.biscuits/common';

export interface ItemCardTypeChipProps {
	item: HubWishlistItem;
	className?: string;
}

export function ItemCardTypeChip({ item, className }: ItemCardTypeChipProps) {
	return (
		<Card.Content unstyled className={clsx('pt-2 pl-1', className)}>
			<Chip color="primary" className="inline-flex">
				<Icon name={typeIcons[item.type]} />
				{item.type}
			</Chip>
		</Card.Content>
	);
}
