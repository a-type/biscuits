import { useSearchParams } from '@verdant-web/react-router';
import { useCallback } from 'react';

export function useEditList() {
  const [_, setParams] = useSearchParams();
  return useCallback(
    (listId: string) => {
      setParams((p) => {
        p.set('listId', listId);
        return p;
      });
    },
    [setParams],
  );
}
