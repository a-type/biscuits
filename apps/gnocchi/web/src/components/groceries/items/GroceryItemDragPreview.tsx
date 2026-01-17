import { Item } from '@gnocchi.biscuits/verdant';
import { useItemDisplayText } from './hooks.js';

export interface GroceryItemDragPreviewProps {
	item: Item;
}

export function GroceryItemDragPreview({ item }: GroceryItemDragPreviewProps) {
	const display = useItemDisplayText(item);
	return (
		<div className="pointer-events-none relative h-32px w-32px flex flex-row items-center justify-center">
			<div className="pointer-events-none absolute max-w-200px translate-y--130% select-none overflow-hidden whitespace-nowrap border-default rounded-lg p-3 shadow-lg bg-white">
				{display}
			</div>
		</div>
	);
}
