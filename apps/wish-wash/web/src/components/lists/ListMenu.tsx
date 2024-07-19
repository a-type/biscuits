import { hooks } from '@/hooks.js';
import { ButtonProps, Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { useCanSync } from '@biscuits/client';
import { useNavigate } from '@verdant-web/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuArrow,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuItemRightSlot,
} from '@a-type/ui/components/dropdownMenu';
import { authorization } from '@wish-wash.biscuits/verdant';

export interface ListMenuProps extends ButtonProps {}

export function ListMenu(props: ListMenuProps) {
  const client = hooks.useClient();

  const navigate = useNavigate();
  const createList = async (isPrivate?: boolean) => {
    const list = await client.lists.put(
      { name: 'Wish list' },
      {
        access: isPrivate ? authorization.private : authorization.public,
      },
    );
    navigate(`/${list.get('id')}?listId=${list.get('id')}`);
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
          <DropdownMenuItem onClick={() => createList(false)}>
            New public list
            <DropdownMenuItemRightSlot>
              <Icon name="add_person" />
            </DropdownMenuItemRightSlot>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => createList(true)}>
          New private list
          <DropdownMenuItemRightSlot>
            <Icon name="plus" />
          </DropdownMenuItemRightSlot>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
