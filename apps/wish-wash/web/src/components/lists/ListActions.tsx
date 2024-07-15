import { ActionBar } from '@a-type/ui/components/actions';
import { UndoAction } from '@/components/actions/UndoAction.js';
import { RedoAction } from '@/components/actions/RedoAction.js';
import { clsx } from '@a-type/ui';

export interface ListActionsProps {
  className?: string;
}

export function ListActions({ className }: ListActionsProps) {
  return (
    <ActionBar className={clsx('bg-wash', className)}>
      <UndoAction />
      <RedoAction />
    </ActionBar>
  );
}
