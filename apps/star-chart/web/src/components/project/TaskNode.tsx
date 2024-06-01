import { Task } from '@star-chart.biscuits/verdant';
import { CanvasObjectRoot, useCanvasObject } from '../canvas/CanvasObject.jsx';
import { hooks } from '@/store.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CanvasObjectDragHandle } from '../canvas/CanvasObjectDragHandle.jsx';
import { TaskMenu } from './TaskMenu.jsx';
import { Checkbox } from '@a-type/ui/components/checkbox';
import { ConnectionSource } from './ConnectionSource.jsx';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { subscribe } from 'valtio';
import { mode } from './mode.js';
import { CollapsibleSimple } from '@a-type/ui/components/collapsible';

export interface TaskNodeProps {
  task: Task;
}

export function TaskNode({ task }: TaskNodeProps) {
  const { id, content, position, completedAt, projectId } =
    hooks.useWatch(task);
  const initialPosition = useMemo(() => position.getSnapshot(), []);

  const canvasObject = useCanvasObject({
    initialPosition,
    objectId: id,
    onDrop: position.update,
  });

  useEffect(() => {
    return position.subscribe('change', () => {
      const pos = position.getSnapshot();
      // TODO: fix Verdant firing change for deleted objects
      if (!pos) return;
      canvasObject.moveTo(pos);
    });
  }, [position, canvasObject]);

  const client = hooks.useClient();
  const createConnectionTo = useCallback(
    (targetTaskId: string) => {
      console.log('connecting', id, targetTaskId);
      client.connections.put({
        projectId,
        sourceTaskId: id,
        targetTaskId,
      });
    },
    [client, id, projectId],
  );

  const [editMode, setEditMode] = useState(false);
  const enterEdit = useCallback(() => {
    setEditMode(true);
    mode.value = 'edit-task';
  }, []);
  useEffect(() => {
    return subscribe(mode, () => {
      if (mode.value !== 'edit-task') {
        setEditMode(false);
      }
    });
  }, []);

  return (
    <CanvasObjectRoot
      className="bg-white border-solid border-2 border-gray-blend p-2 rounded-md shadow-sm"
      canvasObject={canvasObject}
    >
      <CanvasObjectDragHandle onTap={enterEdit}>
        <div className="w-max-content max-w-300px min-w-200px row items-start">
          <Checkbox
            checked={!!completedAt}
            onCheckedChange={(val) => {
              if (val) task.set('completedAt', Date.now());
              else task.set('completedAt', null);
            }}
            data-no-drag
          />
          {editMode ? (
            <LiveUpdateTextField
              className="text-sm min-w-80px w-auto"
              value={content}
              onChange={(v) => task.set('content', v)}
              autoSelect
              autoFocus
            />
          ) : (
            <div className="mt-1 text-sm">{content}</div>
          )}
          <ConnectionSource
            sourceNodeId={id}
            onConnection={createConnectionTo}
            className="ml-auto"
          />
        </div>
        <CollapsibleSimple open={editMode}>
          <TaskMenu task={task} className="ml-auto" data-no-drag />
        </CollapsibleSimple>
      </CanvasObjectDragHandle>
    </CanvasObjectRoot>
  );
}
