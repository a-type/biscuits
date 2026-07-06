import { Item } from '@gnocchi.biscuits/verdant';
import cls from './GroceryItemDragPreview.module.css';
import { useItemDisplayText } from './hooks.js';

export interface GroceryItemDragPreviewProps {
	item: Item;
}

export function GroceryItemDragPreview({ item }: GroceryItemDragPreviewProps) {
	const display = useItemDisplayText(item);
	return (
		<div className={cls.root}>
			<div className={cls.inner}>{display}</div>
		</div>
	);
}
