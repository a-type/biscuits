import { hooks } from '@/hooks.js';
import { Button, Icon } from '@a-type/ui';
import { Item } from '@wish-wash.biscuits/verdant';
import { CSSProperties } from 'react';

export interface ItemStarProps {
	item: Item;
	className?: string;
	style?: CSSProperties;
}

export function ItemStar({ item, className, style }: ItemStarProps) {
	const prioritizedField = hooks.useField(item, 'prioritized');

	return (
		<Button
			emphasis="ghost"
			style={style}
			toggled={prioritizedField.value}
			toggleMode="state-only"
			onClick={() => prioritizedField.setValue(!prioritizedField.value)}
			className={className}
		>
			<Icon name="star" size={20} filled={prioritizedField.value} />
		</Button>
	);
}
