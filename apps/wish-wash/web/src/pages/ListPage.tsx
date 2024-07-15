import { ListActions } from '@/components/lists/ListActions.jsx';
import { ListProvider } from '@/components/lists/ListContext.jsx';
import { ListDetailsEditButton } from '@/components/lists/ListDetailsDialog.jsx';
import { ListHero } from '@/components/lists/ListHero.jsx';
import { ListPicker } from '@/components/lists/ListPicker.jsx';
import { ListView } from '@/components/lists/ListView.jsx';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
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
      <PageContent>
        <div className="row">
          <Button asChild size="small" color="ghost">
            <Link to="/">
              <Icon name="arrowLeft" />
              Home
            </Link>
          </Button>
          <UserMenu
            className="ml-auto my-auto"
            extraItems={
              <ListDetailsEditButton
                listId={list.get('id')}
                key="list-details-edit"
              />
            }
          />
        </div>
        <ListHero list={list} />
        <ListActions className="sticky top-0 z-10" />
        <ListView listId={list.get('id')} />
      </PageContent>
    </ListProvider>
  );
}

export default ListPage;
