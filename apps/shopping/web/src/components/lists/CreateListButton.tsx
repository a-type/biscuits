import { hooks } from '@/store.js';
import { ButtonProps, Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { useNavigate } from '@verdant-web/react-router';
import { MouseEvent } from 'react';

export interface CreateListButtonProps extends ButtonProps {}

export function CreateListButton({
  children,
  onClick,
  ...props
}: CreateListButtonProps) {
  const client = hooks.useClient();
  const navigate = useNavigate();
  const createList = async (ev: MouseEvent<HTMLButtonElement>) => {
    const list = await client.lists.put({ name: 'New list' });
    navigate(`/list/${list.get('id')}`);
    onClick?.(ev);
  };
  return (
    <Button {...props} onClick={createList}>
      {children ?? (
        <>
          <Icon name="plus" />
          New list
        </>
      )}
    </Button>
  );
}
