import { ListProvider } from '@/components/lists/ListContext.jsx';
import { ListDetailsEditButton } from '@/components/lists/ListDetailsDialog.jsx';
import { ListMenu } from '@/components/lists/ListMenu.jsx';
import { ListPicker } from '@/components/lists/ListPicker.jsx';
import { ListView } from '@/components/lists/ListView.jsx';
import { privateHooks } from '@/privateStore.js';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { assert } from '@a-type/utils';
import { useLocalStorage } from '@biscuits/client';
import { Link, useNavigate, useParams } from '@verdant-web/react-router';
import { useEffect, useMemo } from 'react';

export interface ListPageProps {}

export function ListPage({}: ListPageProps) {
  const { listId, visibility } = useParams();
  assert(visibility === 'shared' || visibility === 'private');
  const [_, setLastList] = useLocalStorage<string | null>('last-list', null);

  const publicList = hooks.useList(listId);
  const privateList = privateHooks.useList(listId);
  const list = visibility === 'private' ? privateList : publicList;

  useEffect(() => {
    setLastList(listId);
  }, [listId, setLastList]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!list) {
      setLastList(null);
      navigate('/');
    }
  }, [!!list, setLastList]);

  const publicClient = hooks.useClient();
  const privateClient = privateHooks.useClient();
  const client = visibility === 'private' ? privateClient : publicClient;

  const ctx = useMemo(() => ({ listId, client }), [listId, client]);

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
    <ListProvider value={ctx}>
      <PageContent>
        <PageFixedArea className="flex-row justify-start py-2 mb-2">
          <ListPicker
            value={listId}
            valueVisibility={visibility}
            onChange={(id, isNew, visibility) =>
              navigate(`/${visibility}/${id}${isNew ? `?listId=${id}` : ``}`)
            }
          />
          <ListDetailsEditButton listId={listId} />
        </PageFixedArea>
        <ListView listId={listId} />
      </PageContent>
    </ListProvider>
  );
}

export default ListPage;
