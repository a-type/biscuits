import { ActionBar } from '@a-type/ui/components/actions';
import { UndoAction } from '@/components/actions/UndoAction.js';
import { RedoAction } from '@/components/actions/RedoAction.js';
import { clsx } from '@a-type/ui';
import { ListPublishAction } from './ListPublishAction.jsx';
import { ItemSizeAction } from './ItemSizeAction.jsx';

export interface ListActionsProps {
  className?: string;
  listId: string;
}

export function ListActions({ className, listId }: ListActionsProps) {
  return (
    <ActionBar className={clsx('bg-wash', className)}>
      <UndoAction />
      <RedoAction />
      <ListPublishAction listId={listId} />
      <ItemSizeAction />
    </ActionBar>
  );
}
