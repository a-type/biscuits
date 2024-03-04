import { hooks } from '@/store.js';
import {
  CardActions,
  CardFooter,
  CardGrid,
  CardMain,
  CardRoot,
  CardTitle,
} from '@a-type/ui/components/card';
import { List } from '@trip-tick.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from '@a-type/ui/components/dropdownMenu';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { toast } from 'react-hot-toast';

export interface ListsListProps {}

export function ListsList({}: ListsListProps) {
  const lists = hooks.useAllLists();

  return (
    <CardGrid className="mt-4">
      {lists.map((list) => (
        <CardRoot key={list.get('id')}>
          <CardMain asChild>
            <Link to={`/lists/${list.get('id')}`}>
              <CardTitle>{list.get('name')}</CardTitle>
            </Link>
          </CardMain>
          <CardFooter>
            <CardActions>
              <ListsListItemMenu list={list} />
            </CardActions>
          </CardFooter>
        </CardRoot>
      ))}
    </CardGrid>
  );
}

function ListsListItemMenu({ list }: { list: List }) {
  const client = hooks.useClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" color="ghost">
          <Icon name="dots" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="text-red"
          onClick={() => {
            client.lists.delete(list.get('id'));
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
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
