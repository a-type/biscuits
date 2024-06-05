import { clsx } from '@a-type/ui';
import { useSelectedObjectIds } from '../canvas/canvasHooks.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { disableDragProps } from '../canvas/CanvasObjectDragHandle.jsx';
import { useDeleteConnection, useDeleteTask } from './hooks.js';
import { useMemo } from 'react';

export interface SelectionMenuProps {
  className?: string;
}

export function SelectionMenu({ className }: SelectionMenuProps) {
  const selectedIds = useSelectedObjectIds();
  const hasSelection = selectedIds.length > 1;

  const canvas = useCanvas();
  const deleteTask = useDeleteTask();
  const deleteConnection = useDeleteConnection();

  const [tasks, connections] = useMemo(() => {
    const tasks = selectedIds.filter((id) => {
      const metadata = canvas.objectMetadata.get(id);
      return metadata?.type === 'task';
    });
    const connections = selectedIds.filter((id) => {
      const metadata = canvas.objectMetadata.get(id);
      return metadata?.type === 'connection';
    });
    return [tasks, connections];
  }, [selectedIds, canvas]);

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

  const mixed = tasks.length > 0 && connections.length > 0;

  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-xl p-3 col hidden min-w-200px max-w-80vw',
        'absolute z-100 bottom-1 left-50% transform -translate-1/2',
        hasSelection && 'flex animate-dialog-in',
        className,
      )}
      {...disableDragProps}
    >
      <div className="font-bold">
        {selectedIds.length}{' '}
        {mixed ? 'items' : tasks.length > 0 ? 'tasks' : 'connections'} selected
      </div>
      <div className="row flex-wrap justify-stretch">
        {mixed && (
          <Button
            onClick={() => deleteSelected('task')}
            color="ghostDestructive"
            size="small"
            className="flex-1 justify-center"
          >
            <Icon name="trash" />
            Delete Tasks
          </Button>
        )}
        {mixed && (
          <Button
            onClick={() => deleteSelected('connection')}
            color="ghostDestructive"
            size="small"
            className="flex-1 justify-center"
          >
            <Icon name="trash" />
            Delete Connections
          </Button>
        )}
        <Button
          onClick={() => deleteSelected()}
          color="ghostDestructive"
          size="small"
          className="flex-1 justify-center"
        >
          <Icon name="trash" />
          Delete All
        </Button>
      </div>
    </div>
  );
}
