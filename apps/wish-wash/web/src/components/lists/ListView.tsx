import { hooks } from '@/store.js';
import { List } from '@wish-wash.biscuits/verdant';
import { ListItem } from './ListItem.jsx';
import { PageNowPlaying } from '@a-type/ui/components/layouts';
import { InfiniteLoadTrigger } from '@a-type/ui/components/infiniteLoadTrigger';
import { CreateItemButton } from './CreateItemButton.jsx';
import { ListProvider } from './ListContext.jsx';
import { useMemo } from 'react';
import { CreateItem } from './CreateItem.jsx';

export interface ListViewProps {
  listId: string;
}

export function ListView({ listId }: ListViewProps) {
  const [items, { hasMore, loadMore }] = hooks.useAllItemsInfinite({
    index: {
      where: 'listId',
      equals: listId,
    },
  });

  // TODO: private client
  const client = hooks.useClient();
  const value = useMemo(() => ({ listId, client }), [listId, client]);

  return (
    <ListProvider value={value}>
      <div className="col items-stretch">
        <div className="col items-stretch">
          <CreateItem />
          {items.map((item) => (
            <ListItem item={item} key={item.get('id')} />
          ))}
        </div>
        {hasMore && <InfiniteLoadTrigger onVisible={loadMore} />}
      </div>
    </ListProvider>
  );
}
