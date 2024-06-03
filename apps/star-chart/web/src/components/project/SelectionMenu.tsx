import { clsx } from '@a-type/ui';
import { useSelectedObjectIds } from '../canvas/canvasHooks.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { disableDragProps } from '../canvas/CanvasObjectDragHandle.jsx';
import { useDeleteConnection, useDeleteTask } from './hooks.js';

export interface SelectionMenuProps {
  className?: string;
}

export function SelectionMenu({ className }: SelectionMenuProps) {
  const selectedIds = useSelectedObjectIds();
  const hasSelection = selectedIds.length > 1;

  const canvas = useCanvas();
  const deleteTask = useDeleteTask();
  const deleteConnection = useDeleteConnection();

  const deleteSelected = async (only?: 'task' | 'connection') => {
    await Promise.all(
      selectedIds.map((id) => {
        const metadata = canvas.objectMetadata.get(id);
        if (!metadata) return;

        if (metadata.type === 'task' && only !== 'connection') {
          return deleteTask(id).then((deletedIds) => {
            canvas.selections.removeAll(deletedIds);
          });
        } else if (metadata.type === 'connection' && only !== 'task') {
          return deleteConnection(id).then(() => {
            canvas.selections.remove(id);
          });
        }
      }),
    );
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-xl p-3 col hidden min-w-300px max-w-80vw',
        'absolute z-100 bottom-1 left-50% transform -translate-1/2',
        hasSelection && 'flex animate-dialog-in',
        className,
      )}
      {...disableDragProps}
    >
      <div className="font-bold">{selectedIds.length} items selected</div>
      <div className="row">
        <Button
          onClick={() => deleteSelected('task')}
          color="ghostDestructive"
          size="small"
        >
          <Icon name="trash" />
          Delete Tasks
        </Button>
        <Button
          onClick={() => deleteSelected('connection')}
          color="ghostDestructive"
          size="small"
        >
          <Icon name="trash" />
          Delete Connections
        </Button>
        <Button
          onClick={() => deleteSelected()}
          color="ghostDestructive"
          size="small"
        >
          <Icon name="trash" />
          Delete All
        </Button>
      </div>
    </div>
  );
}
