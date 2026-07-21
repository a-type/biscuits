import { useLocalStorage } from '@biscuits/client';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback } from 'react';

export function useColorSelection() {
	const search = useSearch({ strict: false }) as Record<string, string>;
	const navigate = useNavigate();
	const setColor = useCallback(
		(colorId: string | null) => {
			navigate({
				replace: true,
				search: (prev) =>
					({
						...prev,
						color: colorId || undefined,
					}) as never,
			});
		},
		[navigate],
	);

	return [search.color, setColor] as const;
}

export type ColorSort = 'hue' | 'saturation' | 'lightness';
export function useSort() {
	return useLocalStorage<ColorSort>('sort-palette', 'hue', true);
}
