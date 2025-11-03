import { hooks } from '@/hooks.js';
import { Chip, clsx, Icon } from '@a-type/ui';
import { typeIcons, typeThemes } from '@wish-wash.biscuits/common';
import { Item } from '@wish-wash.biscuits/verdant';

export interface ItemTypeChipProps {
	item: Item;
	className?: string;
}

export function ItemTypeChip({ item, className }: ItemTypeChipProps) {
	const { type } = hooks.useWatch(item);

	return (
		<Chip color={typeThemes[type]} className={clsx(`inline-flex`, className)}>
			<Icon name={typeIcons[type]} />
			{type}
		</Chip>
	);
}
