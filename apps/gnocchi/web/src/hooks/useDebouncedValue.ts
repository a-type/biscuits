import { useStableCallback } from '@a-type/ui';
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(
	value: T | (() => T),
	duration = 500,
	dependencies: any[] = [],
) {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
	const getValue = useStableCallback(
		typeof value === 'function' ? value : ((() => value) as any),
	);
	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedValue(getValue());
		}, duration);
		return () => {
			clearTimeout(timeout);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getValue, duration, ...dependencies]);
	return debouncedValue;
}
