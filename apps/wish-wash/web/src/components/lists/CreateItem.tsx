import { hooks } from '@/hooks.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { useSearchParams } from '@verdant-web/react-router';
import { useListContext } from './ListContext.jsx';
import { clsx } from '@a-type/ui';

export interface CreateItemProps {
  className?: string;
}

export function CreateItem({ className }: CreateItemProps) {
  const { listId } = useListContext();
  const client = hooks.useClient();
  const [_, setSearch] = useSearchParams();

  const createItem = async () => {
    const item = await client.items.put({
      listId,
      description: 'New item',
    });

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
