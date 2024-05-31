import { Task } from '@star-chart.biscuits/verdant';
import { CanvasObjectRoot, useCanvasObject } from '../canvas/CanvasObject.jsx';
import { hooks } from '@/store.js';
import { useCallback, useEffect, useMemo } from 'react';
import { CanvasObjectDragHandle } from '../canvas/CanvasObjectDragHandle.jsx';
import { TaskMenu } from './TaskMenu.jsx';
import { Checkbox } from '@a-type/ui/components/checkbox';
import { ConnectionSource } from './ConnectionSource.jsx';

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

  return (
    <CanvasObjectRoot
      className="bg-white border-default p-2 rounded-md shadow-sm"
      canvasObject={canvasObject}
    >
      <CanvasObjectDragHandle>
        <div className="w-max-content max-w-300px min-w-100px row items-start">
          <Checkbox
            checked={!!completedAt}
            onCheckedChange={(val) => {
              if (val) task.set('completedAt', Date.now());
              else task.set('completedAt', null);
            }}
            data-no-drag
          />
          <div className="mt-1 text-sm">{content}</div>
        </div>
        <div className="w-full row">
          <ConnectionSource
            sourceNodeId={id}
            onConnection={createConnectionTo}
          />
          <TaskMenu task={task} className="ml-auto" data-no-drag />
        </div>
      </CanvasObjectDragHandle>
    </CanvasObjectRoot>
  );
}
