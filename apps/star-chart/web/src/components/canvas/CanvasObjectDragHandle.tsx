import { ReactNode, useCallback, useRef } from 'react';
import { useCanvasObjectContext } from './CanvasObject.jsx';
import { clsx } from '@a-type/ui';

export interface CanvasObjectDragHandleProps {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  onTap?: () => void;
}

export function CanvasObjectDragHandle({
  children,
  disabled,
  className,
  onTap: providedOnTap,
  ...rest
}: CanvasObjectDragHandleProps) {
  const { bindDragHandle, isGrabbing } = useCanvasObjectContext();

  /**
   * This handler prevents click events from firing within the draggable handle
   * if the user was dragging during the gesture - for example we don't want to
   * click a link if the user is dragging it when they release the mouse.
   */
  const onClickCapture = useCallback(
    (ev: React.MouseEvent) => {
      if (isGrabbing) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    },
    [isGrabbing],
  );

  const bindArgsRef = useRef<
    Exclude<Parameters<typeof bindDragHandle>[0], undefined>
  >({});
  if (providedOnTap) {
    bindArgsRef.current.onTap = providedOnTap;
  }

  return (
    <div
      className={clsx(
        'touch-none',
        {
          'cursor-inherit': disabled,
          'cursor-grab': !disabled && !isGrabbing,
          'cursor-grabbing': !disabled && isGrabbing,
        },
        className,
      )}
      {...(disabled ? {} : bindDragHandle(bindArgsRef.current))}
      onClickCapture={onClickCapture}
      {...rest}
    >
      {children}
    </div>
  );
}
