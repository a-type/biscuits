import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuArrow,
  DropdownMenuTrigger,
} from '@a-type/ui/components/dropdownMenu';
import { Icon } from '@a-type/ui/components/icon';
import { List } from '@trip-tick.biscuits/verdant';
import { useNavigate } from '@verdant-web/react-router';
import { toast } from 'react-hot-toast';

export function ListMenu({ list }: { list: List }) {
  const client = hooks.useClient();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" color="ghost">
          <Icon name="dots" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuArrow />
        <DropdownMenuItem
          className="text-red"
          onClick={() => {
            client.lists.delete(list.get('id'));
            navigate('/');
            toast((t) => (
              <span className="flex gap-2 items-center">
                <Icon name="check" />
                <span>List deleted!</span>
                <Button
                  size="small"
                  onClick={() => {
                    client.undoHistory.undo();
                    toast.dismiss(t.id);
                  }}
                >
                  Undo
                </Button>
              </span>
            ));
          }}
        >
          Delete list
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
