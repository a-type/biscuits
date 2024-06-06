import {
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';
import { useCanvasObjectContext } from './CanvasObject.jsx';
import { clsx } from '@a-type/ui';
import { isMiddleClick, isRightClick, stopPropagation } from '@a-type/utils';
import {
  addVectors,
  roundVector,
  subtractVectors,
  vectorLength,
} from './math.js';
import { useCanvas } from './CanvasProvider.jsx';
import { Vector2 } from './types.js';
import { AutoPan } from './AutoPan.js';
import { useGesture } from '@use-gesture/react';
import { CanvasGestureInput } from './Canvas.js';
import { applyGestureState } from './gestureUtils.js';
import { useDragLocked } from './canvasHooks.js';

export interface CanvasObjectDragHandleProps {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function CanvasObjectDragHandle({
  children,
  disabled,
  className,
  ...rest
}: CanvasObjectDragHandleProps) {
  const { isDragging: isGrabbing } = useCanvasObjectContext();
  const bindDragHandle = useDragHandle(disabled);

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
      {...bindDragHandle()}
      onClickCapture={onClickCapture}
      {...rest}
    >
      {children}
    </div>
  );
}

const stopPropagationProps = {
  onPointerDown: stopPropagation,
  onPointerMove: stopPropagation,
  onPointerUp: stopPropagation,
  onTouchStart: stopPropagation,
  onTouchMove: stopPropagation,
  onTouchEnd: stopPropagation,
  onMouseDown: stopPropagation,
  onMouseMove: stopPropagation,
  onMouseUp: stopPropagation,
};

export const disableDragProps = {
  'data-no-drag': true,
  ...stopPropagationProps,
};

function useDragHandle(disabled: boolean = false) {
  const canvas = useCanvas();
  const viewport = canvas.viewport;
  const canvasObject = useCanvasObjectContext();

  const dragLocked = useDragLocked();

  const id = useId();

  // stores the displacement between the user's grab point and the position
  // of the object, in screen pixels
  const grabDisplacementRef = useRef<Vector2>({ x: 0, y: 0 });
  const displace = useCallback((screenPosition: Vector2) => {
    return roundVector(addVectors(screenPosition, grabDisplacementRef.current));
  }, []);

  const gestureInputRef = useRef<CanvasGestureInput>({
    alt: false,
    shift: false,
    ctrlOrMeta: false,
    intentional: false,
    screenPosition: { x: 0, y: 0 },
    delta: { x: 0, y: 0 },
    targetId: canvasObject.id,
  });

  // create a private instance of AutoPan to control the automatic panning behavior
  // that occurs as the user drags an item near the edge of the screen.
  const autoPan = useMemo(() => new AutoPan(viewport), [viewport]);
  // we subscribe to auto-pan events so we can update the position
  // of the object as the viewport moves
  useEffect(() => {
    return autoPan.subscribe(
      'pan',
      ({ cursorPosition }: { cursorPosition: Vector2 | null }) => {
        if (!cursorPosition) return;
        gestureInputRef.current.screenPosition = displace(cursorPosition);
        // all we have to do to move the object as the screen auto-pans is re-trigger a
        // move event with the same cursor position - since the view itself has moved 'below' us,
        // the same cursor position produces the new world position.
        canvas.onObjectDrag(gestureInputRef.current);
      },
    );
  }, [autoPan, viewport, canvas, canvasObject, displace]);

  // binds drag controls to the underlying element
  const bindDragHandle = useGesture(
    {
      onDrag: (state) => {
        if (
          'button' in state.event &&
          (isRightClick(state.event) || isMiddleClick(state.event))
        ) {
          state.cancel();
          return;
        }

        if (canvas.gestureState.claimedBy !== id) {
          state.cancel();
          return;
        }

        if (state.event?.target) {
          const element = state.event?.target as HTMLElement;
          // look up the element tree for a hidden or no-drag element to see if dragging is allowed
          // here.
          const dragPrevented =
            element.getAttribute('aria-hidden') === 'true' ||
            element.getAttribute('data-no-drag') === 'true' ||
            !!element.closest('[data-no-drag="true"], [aria-hidden="true"]');
          // BUGFIX: a patch which is intended to prevent a bug where opening a menu
          // or other popover from within a draggable allows dragging by clicking anywhere
          // on the screen, since the whole screen is covered by a click-blocker element
          // ignore drag events which target an aria-hidden element
          if (dragPrevented) {
            state.cancel();
            return;
          }
        }

        // update gesture info
        Object.assign(gestureInputRef.current, {
          alt: state.event.altKey,
          shift: state.event.shiftKey,
          ctrlOrMeta: state.event.ctrlKey || state.event.metaKey,
          distance: vectorLength(state.distance),
        });

        const screenPosition = { x: state.xy[0], y: state.xy[1] };
        autoPan.update(screenPosition);

        applyGestureState(gestureInputRef.current, state);
        gestureInputRef.current.screenPosition = displace(screenPosition);
        canvas.onObjectDrag(gestureInputRef.current);
      },
      onDragStart: (state) => {
        if (
          'button' in state.event &&
          (isRightClick(state.event) || isMiddleClick(state.event))
        ) {
          state.cancel();
          return;
        }

        console.debug(
          `claiming gesture for ${id} (${canvasObject.id}'s drag handle)`,
        );
        canvas.gestureState.claimedBy = id;

        // update/ reset gesture info
        Object.assign(gestureInputRef.current, {
          alt: state.event.altKey,
          shift: state.event.shiftKey,
          ctrlOrMeta: state.event.ctrlKey || state.event.metaKey,
          distance: vectorLength(state.distance),
        });

        // begin auto-pan using cursor viewport position
        const screenPosition = { x: state.xy[0], y: state.xy[1] };
        autoPan.start(screenPosition);

        // capture the initial displacement between the cursor and the
        // object's center to add to each subsequent position
        const currentObjectPosition = canvas.getViewportPosition(
          canvasObject.id,
        );
        if (currentObjectPosition) {
          const displacement = subtractVectors(
            currentObjectPosition,
            screenPosition,
          );
          grabDisplacementRef.current.x = displacement.x;
          grabDisplacementRef.current.y = displacement.y;
        }

        applyGestureState(gestureInputRef.current, state);
        gestureInputRef.current.screenPosition = displace(screenPosition);
        // apply displacement and begin drag
        canvas.onObjectDragStart(gestureInputRef.current);
      },
      onDragEnd: (state) => {
        if (
          'button' in state.event &&
          (isRightClick(state.event) || isMiddleClick(state.event))
        ) {
          state.cancel();
          return;
        }

        if (canvas.gestureState.claimedBy !== id) {
          state.cancel();
          return;
        }

        // don't claim taps. let parents handle them.
        if (state.tap) {
          console.debug(`${id} is abandoning claim on tap gesture`);
          canvas.gestureState.claimedBy = null;
          state.cancel();
          return;
        }

        // update gesture info
        Object.assign(gestureInputRef.current, {
          alt: state.event.altKey,
          shift: state.event.shiftKey,
          ctrlOrMeta: state.event.ctrlKey || state.event.metaKey,
          distance: vectorLength(state.distance),
        });

        const screenPosition = { x: state.xy[0], y: state.xy[1] };

        applyGestureState(gestureInputRef.current, state);
        gestureInputRef.current.screenPosition = displace(screenPosition);
        canvas.onObjectDragEnd(gestureInputRef.current);
        autoPan.stop();
        grabDisplacementRef.current = { x: 0, y: 0 };
      },
    },
    {
      drag: {
        preventDefault: true,
      },
      enabled: !dragLocked && !disabled,
    },
  );

  return bindDragHandle;
}
