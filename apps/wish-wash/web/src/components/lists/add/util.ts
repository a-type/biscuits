import { id, List, ListItemsItemInit } from '@wish-wash.biscuits/verdant';
import { createdItemState } from '../state.js';

export function addToList(list: List, itemInit: ListItemsItemInit) {
	const items = list.get('items');
	const itemId = id();
	items.push({
		...itemInit,
		id: itemId,
	});
	createdItemState.justCreatedId = itemId;
	return itemId;
}
