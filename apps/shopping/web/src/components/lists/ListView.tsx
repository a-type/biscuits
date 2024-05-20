import { hooks } from '@/store.js';
import { H1 } from '@a-type/ui/components/typography';
import { List } from '@shopping.biscuits/verdant';
import { ListItem } from './ListItem.jsx';

export interface ListViewProps {
  list: List;
}

export function ListView({ list }: ListViewProps) {
  const { name, items } = hooks.useWatch(list);
  return (
    <div className="col">
      <H1>{name}</H1>
      <div className="col">
        {items.map((item) => (
          <ListItem item={item} key={item.get('id')} />
        ))}
      </div>
    </div>
  );
}
