import { hooks } from '@/hooks.js';
import { useSearchParams } from '@verdant-web/react-router';
import { List } from '@wish-wash.biscuits/verdant';
import { useCallback, useMemo } from 'react';

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

export function useSortedItems(list: List) {
  const { items } = hooks.useWatch(list);
  const liveItems = hooks.useWatch(items, { deep: true });
  return useMemo(() => {
    return liveItems.sort((a, b) => {
      if (a.get('prioritized') && !b.get('prioritized')) {
        return -1;
      }
      if (!a.get('prioritized') && b.get('prioritized')) {
        return 1;
      }
      return a.get('createdAt') - b.get('createdAt');
    });
  }, [liveItems]);
}
