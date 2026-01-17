import { AddBar } from '@/components/addBar/AddBar.jsx';
import { useListId } from '@/contexts/ListContext.jsx';
import { useAddItems } from '@/stores/groceries/mutations.js';
import { forwardRef, useCallback } from 'react';

export interface GroceryListAddProps {
	className?: string;
}

export const GroceryListAdd = forwardRef<HTMLDivElement, GroceryListAddProps>(
	function GroceryListAddImpl({ ...rest }, ref) {
		const listId = useListId() || null;
		const addItems = useAddItems();
		const onAdd = useCallback(
			(items: string[]) => {
				return addItems(items, {
					listId,
				});
			},
			[listId, addItems],
		);

		return <AddBar onAdd={onAdd} showRichSuggestions ref={ref} {...rest} />;
	},
);
