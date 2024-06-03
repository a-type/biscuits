import { animated, to } from '@react-spring/web';
import { SVGProps, useEffect, useState } from 'react';
import { LiveVector2, Vector2 } from './types.js';
import { useGesture } from '@use-gesture/react';
import { getWireBezierForEndPoints } from './math.js';
import { useViewport } from './ViewportProvider.jsx';
import { clsx } from '@a-type/ui';
import { useRegister } from './canvasHooks.js';
import { useCanvas } from './CanvasProvider.jsx';
import { CanvasGestureInfo } from './Canvas.js';

export interface WireProps extends Omit<SVGProps<SVGPathElement>, 'ref'> {
  sourcePosition: LiveVector2;
  targetPosition: LiveVector2;
  className?: string;
  hoverClassName?: string;
  onTap?: (relativePosition: Vector2, info: CanvasGestureInfo) => void;
  id: string;
  metadata?: any;
}

export function Wire({
  sourcePosition,
  targetPosition,
  className,
  hoverClassName,
  onTap,
  id,
  metadata,
  ...rest
}: WireProps) {
  const viewport = useViewport();
  const [hovered, setHovered] = useState(false);
  const bind = useGesture(
    {
      onHover: ({ hovering }) => {
        setHovered(!!hovering);
      },
      onDragStart: (state) => {
        state.event.stopPropagation();
        state.event.preventDefault();
      },
      onDrag: (state) => {
        state.event.stopPropagation();
        state.event.preventDefault();
      },
      onDragEnd: (state) => {
        if (state.tap) {
          const worldPos = viewport.viewportToWorld({
            x: state.xy[0],
            y: state.xy[1],
          });

          state.event.preventDefault();
          state.event.stopPropagation();
          onTap?.(worldPos, {
            shift: state.shiftKey,
            ctrlOrMeta: state.ctrlKey || state.metaKey,
            alt: state.altKey,
          });
        }
      },
    },
    {
      eventOptions: { passive: false },
    },
  );

  const curve = to(
    [sourcePosition.x, sourcePosition.y, targetPosition.x, targetPosition.y],
    (startX, startY, endX, endY) => {
      const { control1, control2 } = getWireBezierForEndPoints(
        startX,
        startY,
        endX,
        endY,
      );

      return `M ${startX} ${startY} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${endX} ${endY}`;
    },
  );

  const register = useRegister(id, metadata);
  const canvas = useCanvas();
  // register position as smallest of x,y values - i.e. top left
  useEffect(() => {
    return canvas.bounds.registerOrigin(id, {
      x: to([sourcePosition.x, targetPosition.x], Math.min),
      y: to([sourcePosition.y, targetPosition.y], Math.min),
    });
  }, [canvas, id, sourcePosition, targetPosition]);

  return (
    <>
      {/* invisible path for interaction boundaries */}
      <animated.path
        {...bind()}
        d={curve}
        strokeWidth="20"
        fill="none"
        opacity="50%"
        className={clsx(
          'touch-none',
          onTap && hovered ? hoverClassName : 'stroke-transparent',
          onTap ? 'cursor-pointer' : '',
        )}
        ref={register}
      />
      <animated.path
        id={id}
        d={curve}
        fill="none"
        className={clsx('pointer-events-none', className)}
        data-hovered={hovered}
        {...rest}
      />
    </>
  );
}
