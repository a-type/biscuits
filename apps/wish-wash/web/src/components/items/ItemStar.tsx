import { hooks } from '@/hooks.js';
import { Button, clsx, Icon } from '@a-type/ui';
import { Item } from '@wish-wash.biscuits/verdant';

export interface ItemStarProps {
	item: Item;
	className?: string;
}

export function ItemStar({ item, className }: ItemStarProps) {
	const prioritizedField = hooks.useField(item, 'prioritized');

	return (
		<Button
			size="icon"
			color="ghost"
			toggled={prioritizedField.value}
			toggleMode="state-only"
			onClick={() => prioritizedField.setValue(!prioritizedField.value)}
			className={className}
		>
			<Icon
				name="star"
				className={clsx(
					'w-20px h-20px',
					prioritizedField.value && 'fill-primary',
				)}
			/>
		</Button>
	);
}
