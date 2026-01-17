import { useCallback, useRef } from 'react';

// TODO: convert to useEffectEvent and make sure nothing breaks
export function useStableCallback<T extends (...args: any[]) => any>(
	callback: T,
): T {
	const ref = useRef(callback);
	ref.current = callback;

	// eslint-disable-next-line react-hooks/use-memo
	return useCallback(((...args: any[]) => ref.current(...args)) as T, []);
}
