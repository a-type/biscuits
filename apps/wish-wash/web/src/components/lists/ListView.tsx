import { hooks } from '@/hooks.js';
import { InfiniteLoadTrigger } from '@a-type/ui/components/infiniteLoadTrigger';
import { CreateItem } from './CreateItem.jsx';
import { ListItem } from '../items/ListItem.jsx';
import { clsx } from '@a-type/ui';
import { ItemEditDialog } from '../items/ItemEditDialog.jsx';
import { Suspense } from 'react';
import { CardGrid, cardGridColumns } from '@a-type/ui/components/card';
import { List } from '@wish-wash.biscuits/verdant';
import { useSortedItems } from './hooks.js';

export interface ListViewProps {
  list: List;
  className?: string;
}

export function ListView({ list, className }: ListViewProps) {
  const items = useSortedItems(list);

  return (
    <div className={clsx('col items-stretch gap-4', className)}>
      <CardGrid columns={cardGridColumns.default}>
        {items.map((item) => (
          <ListItem item={item} key={item.get('id')} />
        ))}
      </CardGrid>
      <CreateItem className="sticky bottom-4 z-10" list={list} />
      <Suspense>
        <ItemEditDialog list={list} />
      </Suspense>
    </div>
  );
}
