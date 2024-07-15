import { hooks } from '@/store.js';
import { InfiniteLoadTrigger } from '@a-type/ui/components/infiniteLoadTrigger';
import { CreateItem } from './CreateItem.jsx';
import { ListItem } from '../items/ListItem.jsx';
import { clsx } from '@a-type/ui';
import { ItemEditDialog } from '../items/ItemEditDialog.jsx';
import { Suspense } from 'react';

export interface ListViewProps {
  listId: string;
  className?: string;
}

export function ListView({ listId, className }: ListViewProps) {
  const [items, { hasMore, loadMore }] = hooks.useAllItemsInfinite({
    index: {
      where: 'listId',
      equals: listId,
    },
    key: `items-${listId}`,
  });

  return (
    <div className={clsx('col items-stretch', className)}>
      <div className="col items-stretch">
        {items.map((item) => (
          <ListItem item={item} key={item.get('id')} />
        ))}
        <CreateItem className="sticky bottom-4 z-10" />
      </div>
      {hasMore && <InfiniteLoadTrigger onVisible={loadMore} />}
      <Suspense>
        <ItemEditDialog />
      </Suspense>
    </div>
  );
}
