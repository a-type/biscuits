import { ActionButton } from '@a-type/ui/components/actions';
import { hooks } from '@/store.js';
import { Tooltip } from '@a-type/ui/components/tooltip';
import { Icon } from '@a-type/ui/components/icon';

export function UndoAction({ showName }: { showName?: boolean }) {
  const canUndo = hooks.useCanUndo();
  const groceries = hooks.useClient();

  return (
    <Tooltip content={!canUndo ? 'Nothing to undo' : 'Undo'}>
      <ActionButton
        size="small"
        onClick={() => {
          groceries.undoHistory.undo();
        }}
        icon={<Icon name="undo" />}
        visuallyDisabled={!canUndo}
      >
        {showName ? 'Undo' : undefined}
      </ActionButton>
    </Tooltip>
  );
}
