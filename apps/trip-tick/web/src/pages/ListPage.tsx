import { ListEditor } from '@/components/lists/ListEditor.jsx';
import { hooks } from '@/store.js';
import { Link, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';
import {
  PageContent,
  PageFixedArea,
  PageRoot,
} from '@a-type/ui/components/layouts';
import { DialogActions, DialogClose } from '@a-type/ui/components/dialog';
import { Button } from '@a-type/ui/components/button';

export interface ListPageProps {}

export function ListPage({}: ListPageProps) {
  const params = useParams();
  const listId = params.listId;

  return (
    <>
      <div className="flex-1">
        <Suspense>
          <ListPageEditor listId={listId} />
        </Suspense>
      </div>
      <DialogActions>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogActions>
    </>
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
