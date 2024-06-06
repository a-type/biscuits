import { clsx } from '@a-type/ui';
import { ReactNode } from 'react';
import { disableDragProps } from './CanvasObjectDragHandle.jsx';
import { stopPropagation } from '@a-type/utils';

export interface CanvasOverlayProps {
  className?: string;
  children?: ReactNode;
}

export function CanvasOverlay({
  className,
  children,
  ...rest
}: CanvasOverlayProps) {
  return (
    <div
      className={clsx('absolute pointer-events-none inset-0', className)}
      {...disableDragProps}
      // prevent cancellation further down
      onContextMenu={stopPropagation}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CanvasOverlayContent({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('pointer-events-auto', className)} {...rest}>
      {children}
    </div>
  );
}
