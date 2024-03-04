import { ListEditor } from '@/components/lists/ListEditor.jsx';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { Link, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface ListPageProps {}

export function ListPage({}: ListPageProps) {
  const params = useParams();
  const listId = params.listId;

  return (
    <PageContent>
      <PageFixedArea className="py-2 flex flex-row justify-start">
        <Button asChild color="ghost">
          <Link to="/lists">
            <Icon name="arrowLeft" />
            Back to lists
          </Link>
        </Button>
      </PageFixedArea>
      <Suspense>
        <ListPageEditor listId={listId} />
      </Suspense>
    </PageContent>
  );
}

function ListPageEditor({ listId }: { listId: string }) {
  const list = hooks.useList(listId);

  if (!list) {
    return <div>List not found</div>;
  }

  return <ListEditor list={list} />;
}

export default ListPage;
