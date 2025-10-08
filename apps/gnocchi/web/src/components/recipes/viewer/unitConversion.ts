import { useLocalStorage } from '@biscuits/client';
import { useCallback } from 'react';

export function useUnitConversion(unit: string | null | undefined) {
	const [convertMap, setConvertMap] = useLocalStorage<Record<string, string>>(
		'unit-conversions',
		{},
	);
	const value = unit ? convertMap[unit] ?? undefined : undefined;
	const setValue = useCallback(
		(newValue: string | undefined) => {
			if (!unit) return;
			setConvertMap((current) => {
				if (newValue) {
					return { ...current, [unit]: newValue };
				} else {
					const { [unit]: _, ...rest } = current;
					return rest;
				}
			});
		},
		[setConvertMap, unit],
	);
	return [value, setValue] as const;
}
