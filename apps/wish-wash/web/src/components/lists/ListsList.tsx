import { hooks } from '@/store.js';
import { List } from '@wish-wash.biscuits/verdant';
import {
  CardRoot,
  CardMain,
  CardGrid,
  CardTitle,
} from '@a-type/ui/components/card';
import { InfiniteLoadTrigger } from '@a-type/ui/components/infiniteLoadTrigger';
import { Link } from '@verdant-web/react-router';

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
    </CardRoot>
  );
}
