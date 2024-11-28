import { ActionButton, Icon } from '@a-type/ui';
import { useItemSize } from '../items/hooks.js';

export interface ItemSizeActionProps {
	className?: string;
}

export function ItemSizeAction({ className }: ItemSizeActionProps) {
	const [itemSize, setItemSize] = useItemSize();

	return (
		<ActionButton
			onClick={() => setItemSize(itemSize === 'small' ? 'large' : 'small')}
			className={className}
		>
			Card size:{' '}
			<Icon name={itemSize === 'small' ? 'cardsGrid' : 'cardsMixed'} />
		</ActionButton>
	);
}
