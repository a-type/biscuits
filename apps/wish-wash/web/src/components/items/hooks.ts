import { useLocalStorage } from '@biscuits/client';
import { useNavigate } from '@tanstack/react-router';

export function useEditItem() {
	const navigate = useNavigate();
	return (id: string) =>
		navigate({
			replace: true,
			search: (prev) => ({ ...prev, itemId: id }) as never,
		});
}

export type ItemSize = 'small' | 'large';
export function useItemSize() {
	return useLocalStorage<ItemSize>('item-size', 'large');
}
