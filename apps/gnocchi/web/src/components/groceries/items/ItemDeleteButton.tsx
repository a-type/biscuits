import { hooks } from '@/stores/groceries/index.js';
import { Button, ButtonProps } from '@a-type/ui';
import { Item } from '@gnocchi.biscuits/verdant';

export interface ItemDeleteButtonProps extends Omit<ButtonProps, 'onClick'> {
	item: Item;
}

export function ItemDeleteButton({ item, ...rest }: ItemDeleteButtonProps) {
	const deleteItem = hooks.useDeleteItem();
	const onDelete = () => {
		deleteItem(item);
	};

	return <Button onClick={onDelete} {...rest} />;
}
