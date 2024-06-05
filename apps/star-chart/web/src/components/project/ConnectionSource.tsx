import { hooks } from '@/store.js';
import { clsx } from '@a-type/ui';
import { useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { disableDragProps } from '../canvas/CanvasObjectDragHandle.jsx';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { SvgPortal } from '../canvas/CanvasSvgLayer.jsx';
import { useViewport } from '../canvas/ViewportProvider.jsx';
import { Wire } from '../canvas/Wire.jsx';
import { closestLivePoint } from '../canvas/math.js';
import { Task } from '@star-chart.biscuits/verdant';
import { Vector2 } from '../canvas/types.js';
import { projectState } from './state.js';

export interface ConnectionSourceProps {
  sourceTask: Task;
  onConnection: (targetNodeId: string) => void;
  className?: string;
  children?: ReactNode;
}

export function ConnectionSource({
  sourceTask,
  onConnection,
  className,
  children,
}: ConnectionSourceProps) {
  const sourceNodeId = sourceTask.get('id');

  const [target, spring] = useSpring(() => ({
    x: 0,
    y: 0,
  }));

  const [active, setActive] = useState(false);

  const canvas = useCanvas();
  const viewport = useViewport();
  const client = hooks.useClient();

  const hitTestTasks = useCallback(
    (worldPosition: Vector2) => {
      const objectIds = canvas.bounds.getIntersections(
        {
          x: worldPosition.x,
          y: worldPosition.y,
          width: 0,
          height: 0,
        },
        0,
      );
      const taskId = objectIds.find(
        (id) => canvas.objectMetadata.get(id)?.type === 'task',
      );
      return taskId ?? null;
    },
    [canvas],
  );

  const bind = useGesture({
    onDragStart: ({ xy: [x, y], event }) => {
      event?.stopPropagation();
      const worldPosition = viewport.viewportToWorld({ x, y }, true);
      spring.start({
        x: worldPosition.x,
        y: worldPosition.y,
        immediate: true,
      });
      setActive(true);
    },
    onDrag: ({ xy: [x, y], event }) => {
      event?.stopPropagation();
      const worldPosition = viewport.viewportToWorld({ x, y }, true);
      spring.start({
        x: worldPosition.x,
        y: worldPosition.y,
        immediate: true,
      });
      const taskId = hitTestTasks(worldPosition);
      if (taskId !== sourceNodeId) {
        projectState.activeConnectionTarget = taskId;
      }
    },
    onDragEnd: async ({ xy: [x, y], event }) => {
      event?.stopPropagation();
      const worldPosition = viewport.viewportToWorld({ x, y }, true);
      spring.start({
        x: worldPosition.x,
        y: worldPosition.y,
        immediate: true,
      });

      const taskId = projectState.activeConnectionTarget;
      if (taskId) {
        // don't link to self
        if (taskId === sourceNodeId) {
          setActive(false);
          return;
        }

        // double check it's a task
        const task = await client.tasks.get(taskId).resolved;
        if (!task) {
          setActive(false);
          return;
        }

        onConnection(taskId);
      } else {
        // no target - create a new task at this position and link
        const task = await client.tasks.put({
          projectId: sourceTask.get('projectId'),
          content: 'New Task',
          position: worldPosition,
        });
        // select the new task
        canvas.selections.set([task.get('id')]);
        onConnection(task.get('id'));
      }
      setActive(false);
      projectState.activeConnectionTarget = null;
    },
  });

  const sourceCenter = canvas.getLiveCenter(sourceNodeId);
  const sourceBounds = canvas.getLiveSize(sourceNodeId);
  const sourcePosition = useMemo(
    () =>
      sourceBounds
        ? closestLivePoint(sourceCenter, sourceBounds, target)
        : sourceCenter,
    [sourceCenter, sourceBounds, target],
  );

  return (
    <>
      <div
        {...disableDragProps}
        {...bind()}
        className={clsx(
          'min-w-24px h-24px touch-none cursor-pointer hover:(ring-accent-dark ring-3)',
          className,
        )}
      >
        {children}
      </div>
      <SvgPortal layerId="connections">
        {active && (
          <Wire
            sourcePosition={sourcePosition}
            targetPosition={target}
            markerEnd="url(#arrow-end)"
            className={clsx('stroke-accent stroke-2')}
            id={sourceNodeId + '-pending-connection'}
          />
        )}
      </SvgPortal>
    </>
  );
}
