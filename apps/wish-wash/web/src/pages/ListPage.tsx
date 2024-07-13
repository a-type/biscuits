import { ListProvider } from '@/components/lists/ListContext.jsx';
import { ListDetailsEditButton } from '@/components/lists/ListDetailsDialog.jsx';
import { ListPicker } from '@/components/lists/ListPicker.jsx';
import { ListView } from '@/components/lists/ListView.jsx';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import {
  PageContent,
  PageFixedArea,
  PageNav,
  PageNowPlaying,
} from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { useLocalStorage, UserMenu } from '@biscuits/client';
import { Link, useNavigate, useParams } from '@verdant-web/react-router';
import { List } from '@wish-wash.biscuits/verdant';
import { useEffect, useMemo } from 'react';

export interface ListPageProps {}

export function ListPage({}: ListPageProps) {
  const { listId } = useParams();
  const [_, setLastList] = useLocalStorage<string | null>('last-list', null);

  const list = hooks.useList(listId);
  const navigate = useNavigate();

  useEffect(() => {
    setLastList(listId);
  }, [listId, setLastList]);
  useEffect(() => {
    if (!list) {
      setLastList(null);
      navigate('/');
    }
  }, [!!list, setLastList]);

  const client = hooks.useClient();

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

  return <ListPageContent list={list} />;
}

function ListPageContent({ list }: { list: List }) {
  const ctx = useMemo(() => ({ listId: list.get('id'), list }), [list]);

  return (
    <ListProvider value={ctx}>
      <PageContent fullHeight noPadding>
        <PageFixedArea className="flex-col p-0 gap-2 mb-2">
          <div className="row p-2">
            <ListDetailsEditButton listId={list.get('id')} />
            <UserMenu className="ml-auto" />
          </div>
          <ListPicker value={list.get('id')} />
        </PageFixedArea>
        <ListView listId={list.get('id')} className="m-2" />
      </PageContent>
    </ListProvider>
  );
}

export default ListPage;
