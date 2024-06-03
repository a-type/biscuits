import { stopPropagation } from '@a-type/utils';

export const stopGesturePropagation = {
  onPointerDown: stopPropagation,
  onPointerMove: stopPropagation,
  onPointerCancel: stopPropagation,
  onPointerUp: stopPropagation,
  onMouseDown: stopPropagation,
  onMouseUp: stopPropagation,
  onMouseMove: stopPropagation,
  onTouchStart: stopPropagation,
  onTouchEnd: stopPropagation,
  onTouchMove: stopPropagation,
  onTouchCancel: stopPropagation,
};
