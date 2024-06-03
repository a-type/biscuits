import { useSpring, animated } from '@react-spring/web';
import { useCanvasGestures } from './canvasHooks.js';
import { useRef, useState } from 'react';
import { Vector2 } from './types.js';
import { CanvasGestureInfo } from './Canvas.js';

export interface BoxRegionProps {
  onPending?: (objectIds: string[], info: CanvasGestureInfo) => void;
  onEnd?: (
    objectIds: string[],
    endPosition: Vector2,
    info: CanvasGestureInfo,
  ) => void;
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

  const previousPending = useRef<string[]>([]);

  useCanvasGestures({
    onDragStart: (pos) => {
      previousPending.current = [];
      originRef.current = pos;
      spring.set({ x: pos.x, y: pos.y, width: 0, height: 0 });
    },
    onDrag: (pos, { canvas, info }) => {
      const rect = {
        x: Math.min(pos.x, originRef.current.x),
        y: Math.min(pos.y, originRef.current.y),
        width: Math.abs(pos.x - originRef.current.x),
        height: Math.abs(pos.y - originRef.current.y),
      };
      spring.set(rect);
      const objectIds = canvas.bounds.getIntersections(rect, tolerance);

      // this is all just logic to diff as much as possible...
      if (objectIds.length !== previousPending.current.length) {
        onPending?.(objectIds, info);
      } else if (objectIds.length === 0) {
        if (previousPending.current.length !== 0) {
          onPending?.([], info);
        }
      } else {
        for (let i = 0; i < objectIds.length; i++) {
          if (objectIds[i] !== previousPending.current[i]) {
            onPending?.(objectIds, info);
            break;
          }
        }
      }

      previousPending.current = objectIds;
    },
    onDragEnd: (pos, { canvas, info }) => {
      const objectIds = canvas.bounds.getIntersections(
        {
          x: x.get(),
          y: y.get(),
          width: width.get(),
          height: height.get(),
        },
        tolerance,
      );

      onPending?.([], info);
      onCommit?.(objectIds, pos, info);

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
