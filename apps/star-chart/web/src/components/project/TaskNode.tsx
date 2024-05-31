import { Task } from '@star-chart.biscuits/verdant';
import { CanvasObjectRoot, useCanvasObject } from '../canvas/CanvasObject.jsx';
import { hooks } from '@/store.js';
import { useEffect, useMemo } from 'react';
import { CanvasObjectDragHandle } from '../canvas/CanvasObjectDragHandle.jsx';
import { Icon } from '@a-type/ui/components/icon';
import { useCanvas } from '../canvas/CanvasProvider.jsx';

export interface TaskNodeProps {
  task: Task;
}

export function TaskNode({ task }: TaskNodeProps) {
  const { id, content, position } = hooks.useWatch(task);
  const initialPosition = useMemo(() => position.getSnapshot(), []);

  const canvasObject = useCanvasObject({
    initialPosition,
    objectId: id,
    onDrop: position.update,
  });

  useEffect(() => {
    return position.subscribe('change', () => {
      canvasObject.moveTo(position.getSnapshot());
    });
  }, [position, canvasObject]);

  return (
    <CanvasObjectRoot
      className="bg-white border-default p-2 rounded-md shadow-sm"
      canvasObject={canvasObject}
    >
      <div className="w-max-content max-w-300px">{content}</div>
      <CanvasObjectDragHandle>
        <Icon name="grabby" />
      </CanvasObjectDragHandle>
    </CanvasObjectRoot>
  );
}
