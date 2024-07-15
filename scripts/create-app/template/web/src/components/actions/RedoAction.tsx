import { ActionButton } from '@a-type/ui/components/actions';
import { hooks } from '@/store.js';
import { Icon } from '@a-type/ui/components/icon';

export function RedoAction({ showName }: { showName?: boolean }) {
  const canRedo = hooks.useCanUndo();
  const groceries = hooks.useClient();

  return (
    <ActionButton
      size="small"
      onClick={() => {
        groceries.undoHistory.redo();
      }}
      icon={<Icon name="undo" className="-scale-x-1" />}
      visible={canRedo}
    >
      {showName ? 'Undo' : undefined}
    </ActionButton>
  );
}
