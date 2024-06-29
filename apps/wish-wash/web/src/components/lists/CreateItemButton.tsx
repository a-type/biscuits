import { hooks } from '@/store.js';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { createdItemState } from './state.js';

export interface CreateItemButtonProps extends ButtonProps {
  listId: string;
}

export function CreateItemButton({
  listId,
  children,
  ...rest
}: CreateItemButtonProps) {
  const client = hooks.useClient();
  const createItem = async () => {
    const item = await client.items.put({
      listId,
      description: 'New idea',
    });
    createdItemState.justCreatedId = item.get('id');
  };
  return (
    <Button onClick={createItem}>
      {children ?? (
        <>
          <Icon name="plus" />
          Add idea
        </>
      )}
    </Button>
  );
}
