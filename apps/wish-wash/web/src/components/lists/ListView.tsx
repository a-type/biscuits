import { hooks } from '@/store.js';
import { List } from '@wish-wash.biscuits/verdant';
import { ListItem } from './ListItem.jsx';
import { PageNowPlaying } from '@a-type/ui/components/layouts';
import { InfiniteLoadTrigger } from '@a-type/ui/components/infiniteLoadTrigger';
import { CreateItemButton } from './CreateItemButton.jsx';

export interface ListViewProps {
  list: List;
}

export function ListView({ list }: ListViewProps) {
  const [items, { hasMore, loadMore }] = hooks.useAllItemsInfinite({
    index: {
      where: 'listId',
      equals: list.get('id'),
    },
  });

  return (
    <div className="col items-stretch">
      <div className="col items-stretch">
        {items.map((item) => (
          <ListItem item={item} key={item.get('id')} />
        ))}
      </div>
      {hasMore && <InfiniteLoadTrigger onVisible={loadMore} />}
      <PageNowPlaying unstyled className="row items-center">
        <CreateItemButton listId={list.get('id')} />
      </PageNowPlaying>
    </div>
  );
}
