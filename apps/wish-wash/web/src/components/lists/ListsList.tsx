import { hooks } from '@/hooks.js';
import { List } from '@wish-wash.biscuits/verdant';
import {
  CardRoot,
  CardMain,
  CardGrid,
  CardTitle,
  CardFooter,
} from '@a-type/ui/components/card';
import { InfiniteLoadTrigger } from '@a-type/ui/components/infiniteLoadTrigger';
import { Link } from '@verdant-web/react-router';
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemRightSlot,
  DropdownMenuTrigger,
} from '@a-type/ui/components/dropdownMenu';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { useEditList } from './hooks.js';
import { toast } from '@a-type/ui';

export interface ListsListProps {}

export function ListsList({}: ListsListProps) {
  const [items, { hasMore, loadMore }] = hooks.useAllListsInfinite({
    index: {
      where: 'createdAt',
      order: 'desc',
    },
    pageSize: 20,
  });

  return (
    <>
      <CardGrid>
        {items.map((item, i) => (
          <ListsListItem item={item} key={i} />
        ))}
      </CardGrid>
      {hasMore && <InfiniteLoadTrigger onVisible={loadMore} />}
    </>
  );
}

function ListsListItem({ item }: { item: List }) {
  const { name, id } = hooks.useWatch(item);
  return (
    <CardRoot>
      <CardMain asChild>
        <Link to={`/${id}`}>
          <CardTitle>{name}</CardTitle>
        </Link>
      </CardMain>
      <CardFooter>
        <ListMenu list={item} />
      </CardFooter>
    </CardRoot>
  );
}

function ListMenu({ list }: { list: List }) {
  const editList = useEditList();
  const client = hooks.useClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" color="ghost">
          <Icon name="dots" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuArrow />
        <DropdownMenuItem onClick={() => editList(list.get('id'))}>
          Edit list
          <DropdownMenuItemRightSlot>
            <Icon name="pencil" />
          </DropdownMenuItemRightSlot>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await client
              .batch()
              .run(() => {
                list.deleteSelf();
              })
              .commit();
            const t = toast.success(
              <div className="row">
                List deleted
                <Button
                  size="small"
                  onClick={() => {
                    client.undoHistory.undo();
                    toast.dismiss(t);
                  }}
                >
                  Undo
                </Button>
              </div>,
            );
          }}
          color="destructive"
        >
          Delete list
          <DropdownMenuItemRightSlot>
            <Icon name="trash" />
          </DropdownMenuItemRightSlot>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
