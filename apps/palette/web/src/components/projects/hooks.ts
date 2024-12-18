import { useLocalStorage } from '@biscuits/client';
import { useSearchParams } from '@verdant-web/react-router';
import { useCallback } from 'react';

export function useColorSelection() {
	const [params, setParams] = useSearchParams();
	const setColor = useCallback(
		(colorId: string | null) => {
			setParams((p) => {
				if (!colorId) p.delete('color');
				else p.set('color', colorId);
				return p;
			});
		},
		[setParams],
	);

	return [params.get('color'), setColor] as const;
}

export type ColorSort = 'hue' | 'saturation' | 'lightness';
export function useSort() {
	return useLocalStorage<ColorSort>('sort-palette', 'hue', true);
}
