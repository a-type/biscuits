import { hooks } from '@/store.js';
import { InfiniteLoadTrigger } from '@a-type/ui/components/infiniteLoadTrigger';
import { CreateItem } from './CreateItem.jsx';
import { ListItem } from '../items/ListItem.jsx';
import { clsx } from '@a-type/ui';
import { ItemEditDialog } from '../items/ItemEditDialog.jsx';
import { Suspense } from 'react';
import { CardGrid } from '@a-type/ui/components/card';

export interface ListViewProps {
  listId: string;
  className?: string;
}

export function ListView({ listId, className }: ListViewProps) {
  const [items, { hasMore, loadMore }] = hooks.useAllItemsInfinite({
    index: {
      where: 'listOrder',
      match: {
        listId,
      },
      order: 'desc',
    },
    key: `items-${listId}`,
  });

  return (
    <div className={clsx('col items-stretch gap-4', className)}>
      <CardGrid>
        {items.map((item) => (
          <ListItem item={item} key={item.get('id')} />
        ))}
      </CardGrid>
      {hasMore && <InfiniteLoadTrigger onVisible={loadMore} />}
      <CreateItem className="sticky bottom-4 z-10" />
      <Suspense>
        <ItemEditDialog />
      </Suspense>
    </div>
  );
}
