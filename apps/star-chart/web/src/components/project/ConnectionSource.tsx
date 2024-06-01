import { useGesture } from '@use-gesture/react';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { proxy, subscribe } from 'valtio';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { hooks } from '@/store.js';
import { Wire } from '../canvas/Wire.jsx';
import { Vector2 } from '../canvas/types.js';
import { SvgPortal } from '../canvas/CanvasSvgLayer.jsx';
import { useViewport } from '../canvas/ViewportProvider.jsx';
import { clsx } from '@a-type/ui';
import { useSpring } from '@react-spring/web';
import { closestLivePoint } from '../canvas/math.js';
import { useBlockCount } from './hooks.js';
import { disableDragProps } from '../canvas/CanvasObjectDragHandle.jsx';

export interface ConnectionSourceProps {
  sourceNodeId: string;
  onConnection: (targetNodeId: string) => void;
  className?: string;
}

export function ConnectionSource({
  sourceNodeId,
  onConnection,
  className,
}: ConnectionSourceProps) {
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
      if (!objectId) {
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
      setActive(false);
    },
  });

  const sourceCenter = canvas.getLiveCenter(sourceNodeId);
  const sourceBounds = canvas.getLiveBounds(sourceNodeId);
  const sourcePosition = useMemo(
    () => closestLivePoint(sourceCenter, sourceBounds, target),
    [sourceCenter, sourceBounds, target],
  );

  return (
    <>
      <div
        {...disableDragProps}
        {...bind()}
        className={clsx(
          'w-24px h-24px rounded-full bg-accent-light touch-none flex items-center justify-center text-black cursor-pointer hover:(ring-accent-dark ring-3)',
          className,
        )}
      >
        <Suspense>
          <BlockCount taskId={sourceNodeId} />
        </Suspense>
      </div>
      <SvgPortal layerId="connections">
        <Wire
          sourcePosition={sourcePosition}
          targetPosition={target}
          markerEnd="url(#arrow-end)"
          className={clsx(
            'stroke-accent stroke-2',
            active ? 'opacity-100' : 'opacity-0',
          )}
        />
      </SvgPortal>
    </>
  );
}

function BlockCount({
  taskId,
  className,
}: {
  taskId: string;
  className?: string;
}) {
  const count = useBlockCount(taskId);
  if (count === 0) return null;
  return <span className={className}>{count}</span>;
}
