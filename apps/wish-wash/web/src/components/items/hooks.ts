import { useLocalStorage, useSearchParams } from '@biscuits/client';


export function useEditItem() {
	const [_, setSearch] = useSearchParams();
	return (id: string) =>
		setSearch(
			(s) => {
				s.set('itemId', id);
				return s;
			},
			{
				replace: true,
			},
		);
}

export type ItemSize = 'small' | 'large';
export function useItemSize() {
	return useLocalStorage<ItemSize>('item-size', 'large');
}
