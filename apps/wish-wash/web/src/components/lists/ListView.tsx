import { hooks } from '@/store.js';
import { InfiniteLoadTrigger } from '@a-type/ui/components/infiniteLoadTrigger';
import { CreateItem } from './CreateItem.jsx';
import { ListItem } from '../items/ListItem.jsx';

export interface ListViewProps {
  listId: string;
}

export function ListView({ listId }: ListViewProps) {
  const [items, { hasMore, loadMore }] = hooks.useAllItemsInfinite({
    index: {
      where: 'listId',
      equals: listId,
    },
    key: `items-${listId}`,
  });

  return (
    <div className="col items-stretch">
      <div className="col items-stretch">
        <CreateItem />
        {items.map((item) => (
          <ListItem item={item} key={item.get('id')} />
        ))}
      </div>
      {hasMore && <InfiniteLoadTrigger onVisible={loadMore} />}
    </div>
  );
}
