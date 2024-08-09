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

export function useReordering() {
  const [search, setSearch] = useSearchParams();
  const reordering = search.get('reordering') === 'true';
  return [
    reordering,
    useCallback(
      (value: boolean) => {
        setSearch((s) => {
          s.set('reordering', value ? 'true' : 'false');
          return s;
        });
      },
      [setSearch],
    ),
  ] as const;
}
