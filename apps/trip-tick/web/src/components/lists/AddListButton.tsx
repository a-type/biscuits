import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { useMe } from '@biscuits/client';
import { useNavigate } from '@verdant-web/react-router';
import { ReactNode } from 'react';

export interface AddListButtonProps {
  children?: ReactNode;
  className?: string;
}

export function AddListButton({
  children,
  className,
  ...rest
}: AddListButtonProps) {
  const client = hooks.useClient();
  const navigate = useNavigate();
  const { data: me } = useMe();
  const allLists = hooks.useAllLists();
  const hasLists = allLists.length > 0;

  return (
    <Button
      color="primary"
      onClick={async () => {
        if (hasLists) {
          const list = await client.lists.put({
            name: 'New list',
          });
          navigate(`/lists/${list.get('id')}`);
        } else {
          const listName = me ? me.me.name : `My stuff`;
          const list = await client.lists.put({
            name: listName,
          });
          navigate(`/lists/${list.get('id')}`);
        }
      }}
      className={className}
      {...rest}
    >
      {children || 'Add list'}
    </Button>
  );
}
