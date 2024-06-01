import { animated, to } from '@react-spring/web';
import { SVGProps } from 'react';
import { LiveVector2 } from './types.js';

export interface WireProps extends Omit<SVGProps<SVGPathElement>, 'ref'> {
  sourcePosition: LiveVector2;
  targetPosition: LiveVector2;
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
        (startX, startY, endX, endY) => {
          // choose which way to bend by determining if it's horizontal
          // or vertical
          if (Math.abs(startX - endX) > Math.abs(startY - endY)) {
            const control1X = startX + (endX - startX) / 2;
            const control1Y = startY;
            const control2X = endX - (endX - startX) / 2;
            const control2Y = endY;
            return `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`;
          }
          const control1X = startX;
          const control1Y = startY + (endY - startY) / 2;
          const control2X = endX;
          const control2Y = endY - (endY - startY) / 2;
          return `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`;
        },
      )}
      fill="none"
      className={className}
      {...rest}
    />
  );
}
