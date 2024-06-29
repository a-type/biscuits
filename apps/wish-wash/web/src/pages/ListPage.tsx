import { ListDetailsEditButton } from '@/components/lists/ListDetailsDialog.jsx';
import { ListPicker } from '@/components/lists/ListPicker.jsx';
import { ListView } from '@/components/lists/ListView.jsx';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { useLocalStorage } from '@biscuits/client';
import { Link, useNavigate, useParams } from '@verdant-web/react-router';
import { useEffect } from 'react';

export interface ListPageProps {}

export function ListPage({}: ListPageProps) {
  const { listId } = useParams();
  const [_, setLastList] = useLocalStorage<string | null>('last-list', null);

  const list = hooks.useList(listId);

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
      <PageFixedArea className="flex-row justify-start py-2 mb-2">
        <ListPicker
          value={listId}
          onChange={(id, isNew) =>
            navigate(`/list/${id}${isNew ? `?listId=${id}` : ``}`)
          }
        />
        <ListDetailsEditButton listId={listId} />
      </PageFixedArea>
      <ListView listId={listId} />
    </PageContent>
  );
}

export default ListPage;
