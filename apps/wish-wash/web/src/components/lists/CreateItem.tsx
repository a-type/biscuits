import { hooks } from '@/hooks.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { useSearchParams } from '@verdant-web/react-router';
import { clsx } from '@a-type/ui';
import { List } from '@wish-wash.biscuits/verdant';

export interface CreateItemProps {
  className?: string;
  list: List;
}

export function CreateItem({ className, list }: CreateItemProps) {
  const { id: listId, items } = hooks.useWatch(list);
  const [_, setSearch] = useSearchParams();

  const createItem = async () => {
    items.push({
      description: 'New item',
    });
    const item = items.get(items.length - 1);

    setSearch((s) => {
      s.set('itemId', item.get('id'));
      return s;
    });
  };

  return (
    <div className={clsx('row justify-center', className)}>
      <Button onClick={createItem} color="primary" className="shadow-md">
        <Icon name="plus" />
        New item
      </Button>
    </div>
  );
}
