import { ListView } from '@/components/lists/ListView.jsx';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { PageContent } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { useLocalStorage } from '@biscuits/client';
import { Link, useParams } from '@verdant-web/react-router';

export interface ListPageProps {}

export function ListPage({}: ListPageProps) {
  const { listId } = useParams();
  const [_, setLastList] = useLocalStorage<string | null>('last-list', null);
  setLastList(listId);

  const list = hooks.useList(listId);

  if (!list) {
    return (
      <PageContent>
        <H1>List not found</H1>
        <Button asChild>
          <Link to="/">Go back</Link>
        </Button>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <ListView list={list} />
    </PageContent>
  );
}

export default ListPage;
