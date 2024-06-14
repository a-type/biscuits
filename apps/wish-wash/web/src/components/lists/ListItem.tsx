import { ListItemsItem } from '@wish-wash.biscuits/verdant';
import { Checkbox } from '@a-type/ui/components/checkbox';
import { hooks } from '@/store.js';

export interface ListItemProps {
  item: ListItemsItem;
}

export function ListItem({ item }: ListItemProps) {
  const { purchasedAt, description, link } = hooks.useWatch(item);

  return (
    <div className="row">
      <Checkbox
        checked={!!purchasedAt}
        onCheckedChange={(val) => {
          if (val) {
            item.set('purchasedAt', Date.now());
          } else {
            item.set('purchasedAt', null);
          }
        }}
      />
      <div>
        {description}
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer">
            (link)
          </a>
        )}
      </div>
    </div>
  );
}
