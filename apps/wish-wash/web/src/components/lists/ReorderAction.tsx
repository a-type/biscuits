import { ActionButton } from '@a-type/ui/components/actions';
import { useReordering } from './hooks.js';
import { Icon } from '@a-type/ui/components/icon';

export interface ReorderActionProps {
  className?: string;
}

export function ReorderAction({ className }: ReorderActionProps) {
  const [reordering, setReordering] = useReordering();

  return (
    <ActionButton
      onClick={() => setReordering(!reordering)}
      className={className}
      icon={<Icon name="convert" />}
    >
      {reordering ? 'Done' : 'Reorder'}
    </ActionButton>
  );
}
