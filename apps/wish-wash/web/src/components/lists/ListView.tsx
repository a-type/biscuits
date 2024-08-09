import { clsx } from '@a-type/ui';
import { CardGrid, cardGridColumns } from '@a-type/ui/components/card';
import { List } from '@wish-wash.biscuits/verdant';
import { Suspense } from 'react';
import { useItemSize } from '../items/hooks.js';
import { ItemEditDialog } from '../items/ItemEditDialog.jsx';
import { ListItem } from '../items/ListItem.jsx';
import { CreateItem } from './CreateItem.jsx';
import { ItemSorter } from './ItemSorter.jsx';
import { hooks } from '@/hooks.js';

export interface ListViewProps {
  list: List;
  className?: string;
}

export function ListView({ list, className }: ListViewProps) {
  const { items } = hooks.useWatch(list);
  hooks.useWatch(items);
  const [itemSize] = useItemSize();

  return (
    <div className={clsx('col items-stretch gap-4', className)}>
      <CreateItem className="sticky top-4 z-10 self-center" list={list} />
      <div className="row items-stretch">
        <CardGrid
          columns={
            itemSize === 'large'
              ? cardGridColumns.default
              : cardGridColumns.small
          }
          className="flex-1"
        >
          {items.map((item) => (
            <ListItem item={item} key={item.get('id')} />
          ))}
        </CardGrid>
        <ItemSorter list={list} />
      </div>
      <Suspense>
        <ItemEditDialog list={list} />
      </Suspense>
    </div>
  );
}
