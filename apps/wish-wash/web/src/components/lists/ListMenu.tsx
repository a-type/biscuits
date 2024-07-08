import { privateHooks } from '@/privateStore.js';
import { hooks } from '@/store.js';
import { ButtonProps, Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { useCanSync } from '@biscuits/client';
import { useNavigate } from '@verdant-web/react-router';
import { MouseEvent } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuArrow,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuItemRightSlot,
} from '@a-type/ui/components/dropdownMenu';

export interface ListMenuProps extends ButtonProps {}

export function ListMenu({ children, onClick, ...props }: ListMenuProps) {
  const client = hooks.useClient();
  const privateClient = privateHooks.useClient();

  const navigate = useNavigate();
  const createPublicList = async (ev: MouseEvent<any>) => {
    const list = await client.lists.put({ name: 'New list' });
    navigate(`/shared/${list.get('id')}?listId=${list.get('id')}`);
    onClick?.(ev);
  };

  const createPrivateList = async (ev: MouseEvent<any>) => {
    const list = await privateClient.lists.put({ name: 'New list' });
    navigate(`/private/${list.get('id')}?listId=${list.get('id')}`);
    onClick?.(ev);
  };

  const canSync = useCanSync();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" color="ghost" {...props}>
          <Icon name="dots" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuArrow />
        {canSync && (
          <DropdownMenuItem onClick={createPublicList}>
            New public list
            <DropdownMenuItemRightSlot>
              <Icon name="add_person" />
            </DropdownMenuItemRightSlot>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={createPrivateList}>
          New private list
          <DropdownMenuItemRightSlot>
            <Icon name="plus" />
          </DropdownMenuItemRightSlot>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
