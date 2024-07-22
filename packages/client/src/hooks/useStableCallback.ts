import { useCallback, useRef } from 'react';

export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
): T {
  const ref = useRef(callback);
  ref.current = callback;

  return useCallback(((...args: any[]) => ref.current(...args)) as T, []);
}
