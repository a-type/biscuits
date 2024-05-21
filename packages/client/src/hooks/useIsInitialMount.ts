import { useEffect, useRef } from 'react';

export function useIsInitialMount() {
  const isInitialMount = useRef(true);
  useEffect(() => {
    isInitialMount.current = false;
  }, []);
  return isInitialMount.current;
}
