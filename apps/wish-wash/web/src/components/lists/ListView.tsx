import { hooks } from '@/store.js';
import { List } from '@wish-wash.biscuits/verdant';
import { ListItem } from './ListItem.jsx';
import { PageNowPlaying } from '@a-type/ui/components/layouts';
import { CreateItemButton } from './CreateItemButton.jsx';

export interface ListViewProps {
  list: List;
}

export function ListView({ list }: ListViewProps) {
  const { items } = hooks.useWatch(list);
  hooks.useWatch(items);
  return (
    <div className="col items-stretch">
      <div className="col items-stretch">
        {items.map((item) => (
          <ListItem item={item} key={item.get('id')} />
        ))}
      </div>
      <PageNowPlaying unstyled className="row items-center">
        <CreateItemButton list={list} />
      </PageNowPlaying>
    </div>
  );
}
