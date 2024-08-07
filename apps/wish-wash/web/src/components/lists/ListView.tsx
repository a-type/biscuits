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
import { useItemSize } from '../items/hooks.js';

export interface ListViewProps {
  list: List;
  className?: string;
}

export function ListView({ list, className }: ListViewProps) {
  const items = useSortedItems(list);
  const [itemSize] = useItemSize();

  return (
    <div className={clsx('col items-stretch gap-4', className)}>
      <CreateItem className="sticky top-4 z-10 self-center" list={list} />
      <CardGrid
        columns={
          itemSize === 'large' ? cardGridColumns.default : cardGridColumns.small
        }
      >
        {items.map((item) => (
          <ListItem item={item} key={item.get('id')} />
        ))}
      </CardGrid>
      <Suspense>
        <ItemEditDialog list={list} />
      </Suspense>
    </div>
  );
}
