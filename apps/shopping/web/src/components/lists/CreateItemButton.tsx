import { ButtonProps, Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { List } from '@shopping.biscuits/verdant';

export interface CreateItemButtonProps extends ButtonProps {
  list: List;
}

export function CreateItemButton({
  list,
  children,
  ...rest
}: CreateItemButtonProps) {
  const createItem = () => {
    const item = list.get('items').push({
      description: 'New idea',
    });
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
