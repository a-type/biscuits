import { hooks } from '@/store.js';
import { H1 } from '@a-type/ui/components/typography';
import { List } from '@shopping.biscuits/verdant';
import { ListItem } from './ListItem.jsx';
import { PageNowPlaying } from '@a-type/ui/components/layouts';
import { CreateItemButton } from './CreateItemButton.jsx';

export interface ListViewProps {
  list: List;
}

export function ListView({ list }: ListViewProps) {
  const { name, items } = hooks.useWatch(list);
  hooks.useWatch(items);
  return (
    <div className="col items-stretch">
      <H1>{name}</H1>
      <div className="col items-stretch">
        {items.map((item) => (
          <ListItem item={item} key={item.get('id')} />
        ))}
      </div>
      <PageNowPlaying unstyled className="justify-end">
        <CreateItemButton list={list} />
      </PageNowPlaying>
    </div>
  );
}
