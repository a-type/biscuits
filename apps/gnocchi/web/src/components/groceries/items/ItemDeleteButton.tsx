import { useDeleteItem } from '@/stores/groceries/mutations.js';
import { Button, ButtonProps } from '@a-type/ui';
import { Item } from '@gnocchi.biscuits/verdant';

export interface ItemDeleteButtonProps extends Omit<ButtonProps, 'onClick'> {
	item: Item;
}

export function ItemDeleteButton({ item, ...rest }: ItemDeleteButtonProps) {
	const deleteItem = useDeleteItem();
	const onDelete = () => {
		deleteItem(item);
	};

	return <Button onClick={onDelete} {...rest} />;
}
