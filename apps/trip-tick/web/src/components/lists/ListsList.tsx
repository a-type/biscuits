import { hooks } from '@/store.js';
import {
  CardActions,
  CardFooter,
  CardGrid,
  CardMain,
  CardRoot,
} from '@a-type/ui/components/card';
import { List } from '@packing-list/verdant';
import { Link } from '@verdant-web/react-router';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from '@a-type/ui/components/dropdownMenu';
import { Button } from '@a-type/ui/components/button';

export interface ListsListProps {}

export function ListsList({}: ListsListProps) {
  const lists = hooks.useAllLists();

  return (
    <CardGrid className="mt-4">
      {lists.map((list) => (
        <CardRoot key={list.get('id')}>
          <CardMain asChild>
            <Link to={`/lists/${list.get('id')}`}>{list.get('name')}</Link>
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
        <Button size="icon">
          <span
            style={{
              width: 15,
              height: 15,
              display: 'block',
              fontSize: 12,
              fontWeight: 100,
            }}
          >
            ≡
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            client.lists.delete(list.get('id'));
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
