import { ListEditor } from '@/components/lists/ListEditor.jsx';
import { ListMenu } from '@/components/lists/ListMenu.jsx';
import { hooks } from '@/store.js';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { usePageTitle } from '@biscuits/client';
import { AutoRestoreScroll, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface ListPageProps {}

export function ListPage({}: ListPageProps) {
  const params = useParams();
  const listId = params.listId;

  return (
    <PageContent>
      <Suspense>
        <ListPageEditor listId={listId} />
      </Suspense>
      <AutoRestoreScroll />
    </PageContent>
  );
}

function ListPageEditor({ listId }: { listId: string }) {
  const list = hooks.useList(listId);
  usePageTitle(list?.get('name') ?? 'List');

  if (!list) {
    return <div>List not found</div>;
  }

  return (
    <>
      <PageFixedArea className="row justify-end w-full">
        <ListMenu list={list} />
      </PageFixedArea>
      <ListEditor list={list} />
    </>
  );
}

export default ListPage;
