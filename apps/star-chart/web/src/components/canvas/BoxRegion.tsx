import { useSpring, animated } from '@react-spring/web';
import { useCanvasGestures } from './canvasHooks.js';
import { useRef, useState } from 'react';
import { Vector2 } from './types.js';
import { CanvasGestureInfo } from './Canvas.js';
import { useCanvas } from './CanvasProvider.jsx';

export interface BoxRegionProps {
  onPending?: (objectIds: Set<string>, info: CanvasGestureInfo) => void;
  onEnd?: (objectIds: Set<string>, info: CanvasGestureInfo) => void;
  tolerance?: number;
  className?: string;
}

export function BoxRegion({
  tolerance = 0.5,
  onPending,
  onEnd: onCommit,
  className,
}: BoxRegionProps) {
  const [{ x, y, width, height }, spring] = useSpring(() => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }));
  const originRef = useRef<Vector2>({ x: 0, y: 0 });

  const previousPending = useRef<Set<string>>(new Set<string>());

  const canvas = useCanvas();

  useCanvasGestures({
    onDragStart: (info) => {
      previousPending.current = new Set<string>();
      originRef.current = info.worldPosition;
      spring.set({
        x: info.worldPosition.x,
        y: info.worldPosition.y,
        width: 0,
        height: 0,
      });
    },
    onDrag: (info) => {
      const rect = {
        x: Math.min(info.worldPosition.x, originRef.current.x),
        y: Math.min(info.worldPosition.y, originRef.current.y),
        width: Math.abs(info.worldPosition.x - originRef.current.x),
        height: Math.abs(info.worldPosition.y - originRef.current.y),
      };
      spring.set(rect);
      const objectIds = canvas.bounds.getIntersections(rect, tolerance);

      // this is all just logic to diff as much as possible...
      if (objectIds.size !== previousPending.current.size) {
        onPending?.(objectIds, info);
      } else if (objectIds.size === 0) {
        if (previousPending.current.size !== 0) {
          onPending?.(objectIds, info);
        }
      } else {
        for (const entry of objectIds) {
          if (!previousPending.current.has(entry)) {
            onPending?.(objectIds, info);
            break;
          }
        }
      }

      previousPending.current = objectIds;
    },
    onDragEnd: (info) => {
      const objectIds = canvas.bounds.getIntersections(
        {
          x: x.get(),
          y: y.get(),
          width: width.get(),
          height: height.get(),
        },
        tolerance,
      );

      onPending?.(new Set(), info);
      onCommit?.(objectIds, info);

      spring.set({ x: 0, y: 0, width: 0, height: 0 });
      originRef.current.x = 0;
      originRef.current.y = 0;
    },
  });

  return (
    <animated.rect
      x={x}
      y={y}
      width={width}
      height={height}
      className={className}
    />
  );
}
