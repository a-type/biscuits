import { debounce } from '@a-type/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useDebounced<T>(value: T, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => clearTimeout(timeout);
	}, [value, delay]);

	return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number,
) {
	const [debouncedCallback] = useState(() => {
		let timeout: number | any;
		return (...args: Parameters<T>) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				callback(...args);
			}, delay);
		};
	});

	return debouncedCallback;
}

export function useDebouncedState<T>(
	syncedValue: T,
	onCommitChange: (value: T) => void,
	debounceTime = 500,
) {
	const [localValue, setLocalValue] = useState<T | undefined>(undefined);
	// specifically doing this so the commit still happens even
	// if the component unmounts
	const commitChangeRef = useRef(onCommitChange);
	commitChangeRef.current = onCommitChange;
	const debouncedCommit = useMemo(
		() =>
			debounce((value: T) => {
				commitChangeRef.current(value);
				setLocalValue(undefined);
			}, debounceTime),
		[],
	);

	const setValue = useCallback(
		(v: T) => {
			setLocalValue(v);
			debouncedCommit(v);
		},
		[debouncedCommit],
	);

	return [localValue ?? syncedValue, setValue] as const;
}
