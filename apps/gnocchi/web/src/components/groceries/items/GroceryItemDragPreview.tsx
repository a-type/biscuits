import { Item } from '@gnocchi.biscuits/verdant';
import { useItemDisplayText } from './hooks.js';

export interface GroceryItemDragPreviewProps {
	item: Item;
}

export function GroceryItemDragPreview({ item }: GroceryItemDragPreviewProps) {
	const display = useItemDisplayText(item);
	return (
		<div className="flex flex-row items-center justify-center pointer-events-none relative w-32px h-32px">
			<div className="absolute translate-y--130% p-3 rounded-lg bg-white border-default whitespace-nowrap shadow-lg select-none pointer-events-none max-w-200px overflow-hidden">
				{display}
			</div>
		</div>
	);
}
