import { useEffect } from 'react';
import { Vector2 } from './types.js';
import { useSpring, animated, to, SpringValue } from '@react-spring/web';

export interface WireProps {
  sourcePosition: { x: SpringValue<number>; y: SpringValue<number> };
  targetPosition: { x: SpringValue<number>; y: SpringValue<number> };
  className?: string;
}

export function Wire({
  sourcePosition,
  targetPosition,
  className,
  ...rest
}: WireProps) {
  return (
    <animated.path
      d={to(
        [
          sourcePosition.x,
          sourcePosition.y,
          targetPosition.x,
          targetPosition.y,
        ],
        (startX, startY, endX, endY) =>
          `M ${startX} ${startY} l ${endX - startX} ${endY - startY}`,
      )}
      className={className}
      {...rest}
    />
  );
}
