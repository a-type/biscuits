import { hooks } from '@/store.js';
import { clsx } from '@a-type/ui';
import { useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { ReactNode, useMemo, useState } from 'react';
import { disableDragProps } from '../canvas/CanvasObjectDragHandle.jsx';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { SvgPortal } from '../canvas/CanvasSvgLayer.jsx';
import { useViewport } from '../canvas/ViewportProvider.jsx';
import { Wire } from '../canvas/Wire.jsx';
import { closestLivePoint } from '../canvas/math.js';
import { Task } from '@star-chart.biscuits/verdant';

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
    },
    onDragEnd: async ({ xy: [x, y], event }) => {
      event?.stopPropagation();
      const worldPosition = viewport.viewportToWorld({ x, y }, true);
      spring.start({
        x: worldPosition.x,
        y: worldPosition.y,
        immediate: true,
      });

      // see if we're over a target
      const objectId = canvas.hitTest(worldPosition);
      if (objectId) {
        // don't link to self
        if (objectId === sourceNodeId) {
          setActive(false);
          return;
        }

        // verify it's a task node
        const task = await client.tasks.get(objectId).resolved;
        if (!task) {
          setActive(false);
          return;
        }

        onConnection(objectId);
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