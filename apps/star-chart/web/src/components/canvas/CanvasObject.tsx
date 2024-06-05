import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useCanvas } from './CanvasProvider.jsx';
import { useViewport } from './ViewportProvider.jsx';
import { to, useSpring, animated } from '@react-spring/web';
import { Vector2 } from './types.js';
import { SPRINGS } from './constants.js';
import { addVectors, roundVector, subtractVectors } from './math.js';
import { AutoPan } from './AutoPan.js';
import { useGesture } from '@use-gesture/react';
import {
  isRightClick,
  isMiddleClick,
  stopPropagation,
  preventDefault,
} from '@a-type/utils';
import { clsx } from '@a-type/ui';
import { useRerasterize } from './rerasterizeSignal.js';
import { useEffectOnce, useMergedRef } from '@biscuits/client';
import { useRegister } from './canvasHooks.js';

export interface CanvasObjectRootProps {
  children: ReactNode;
  className?: string;
  canvasObject: CanvasObject;
}

export function CanvasObjectRoot({
  children,
  className,
  canvasObject,
  ...rest
}: CanvasObjectRootProps) {
  const ref = useRef<HTMLDivElement>(null);
  useRerasterize(ref);

  const register = useRegister(canvasObject.id, canvasObject.metadata);
  const finalRef = useMergedRef(ref, register);

  return (
    <CanvasObjectContext.Provider value={canvasObject}>
      <animated.div
        ref={finalRef}
        className={clsx('absolute', className)}
        // this is blocking undo keybinds...
        // onKeyDown={stopPropagation}
        // onKeyUp={stopPropagation}
        onPointerDown={stopPropagation}
        onPointerUp={stopPropagation}
        onPointerMove={stopPropagation}
        onDragStart={preventDefault}
        onDragEnd={preventDefault}
        onDrag={preventDefault}
        {...canvasObject.rootProps}
        {...rest}
      >
        {children}
        {/* <DebugAnnotations /> */}
      </animated.div>
    </CanvasObjectContext.Provider>
  );
}

export interface CanvasObject {
  bindDragHandle: (args?: { onTap?: () => void }) => any;
  isGrabbing: boolean;
  rootProps: any;
  moveTo: (position: Vector2, interpolate?: boolean) => void;
  id: string;
  metadata: any;
}

const CanvasObjectContext = createContext<CanvasObject | null>(null);

export function useCanvasObjectContext() {
  const ctx = useContext(CanvasObjectContext);
  if (!ctx)
    throw new Error(
      'useCanvasObject must be called inside a CanvasObjectProvider',
    );

  return ctx;
}

export function useCanvasObject({
  initialPosition,
  objectId,
  zIndex = 0,
  onDrop,
  onDrag,
  metadata,
}: {
  initialPosition: Vector2;
  objectId: string;
  onDrop?: (pos: Vector2) => any;
  onDrag?: (pos: Vector2) => any;
  zIndex?: number;
  metadata?: any;
}) {
  const canvas = useCanvas();

  const { pickupSpring, isGrabbing, bindDragHandle, dragSpring, dragStyle } =
    useDrag({
      initialPosition,
      objectId,
      onDrag,
      onDragEnd: onDrop,
    });

  /**
   * ONLY MOVES THE VISUAL NODE.
   * Update the actual backing data to make real movements.
   * This should be hooked up to backing data changes.
   */
  const moveTo = useCallback(
    (position: Vector2) => {
      dragSpring.start({
        x: position.x,
        y: position.y,
      });
    },
    [objectId, dragSpring],
  );

  // FIXME: find a better place to do this?
  useEffect(
    () => canvas.bounds.registerOrigin(objectId, dragStyle),
    [canvas, objectId],
  );

  const canvasObject: CanvasObject = useMemo(() => {
    const rootProps = {
      style: {
        /**
         * Translate to the correct position, offset by origin,
         * and apply a subtle bouncing scale effect when picked
         * up or dropped.
         */
        transform: to(
          [dragStyle.x, dragStyle.y, pickupSpring.value],
          (xv, yv, grabEffect) =>
            `translate(${xv}px, ${yv}px) scale(${1 + 0.05 * grabEffect})`,
        ),
        zIndex,
        cursor: isGrabbing ? 'grab' : 'inherit',
      },
    };

    return {
      bindDragHandle,
      isGrabbing,
      rootProps,
      moveTo,
      id: objectId,
      metadata,
    };
  }, [canvas, pickupSpring, zIndex, isGrabbing, bindDragHandle, objectId]);

  return canvasObject;
}

function useDrag({
  initialPosition,
  objectId,
  onDragStart,
  onDragEnd,
  onDrag,
}: {
  initialPosition: Vector2;
  objectId: string;
  onDragStart?: (pos: Vector2) => void;
  onDragEnd?: (pos: Vector2) => void;
  onDrag?: (pos: Vector2) => any;
}) {
  const canvas = useCanvas();
  const viewport = useViewport();

  const [isGrabbing, setIsGrabbing] = useState(false);

  const [dragStyle, dragSpring] = useSpring(() => initialPosition);

  const pickupSpring = useSpring({
    value: isGrabbing ? 1 : 0,
    config: SPRINGS.WOBBLY,
  });

  // stores the displacement between the user's grab point and the position
  // of the object, in screen pixels
  const grabDisplacementRef = useRef<Vector2>({ x: 0, y: 0 });
  const displace = useCallback((screenPosition: Vector2) => {
    return roundVector(addVectors(screenPosition, grabDisplacementRef.current));
  }, []);

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
        // all we have to do to move the object as the screen auto-pans is re-trigger a
        // move event with the same cursor position - since the view itself has moved 'below' us,
        // the same cursor position produces the new world position.
        const finalPosition = viewport.viewportToWorld(
          displace(cursorPosition),
        );
        dragSpring.set(finalPosition);
      },
    );
  }, [autoPan, viewport, canvas, objectId, displace]);

  // binds drag controls to the underlying element
  const bindDragHandle = useGesture({
    onDrag: (state) => {
      if (
        'button' in state.event &&
        (isRightClick(state.event) || isMiddleClick(state.event))
      ) {
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

      if (state.distance.length > 10) {
        setIsGrabbing(true);
      }

      const screenPosition = { x: state.xy[0], y: state.xy[1] };
      autoPan.update(screenPosition);

      // TODO: DELETE - canvas no longer controls object positions.
      // send to canvas to be interpreted into movement
      // canvas.onObjectDrag(displace(screenPosition), objectId);

      const position = viewport.viewportToWorld(displace(screenPosition));
      dragSpring.set(position);
      onDrag?.(position);
    },
    onDragStart: (state) => {
      if (
        'button' in state.event &&
        (isRightClick(state.event) || isMiddleClick(state.event))
      ) {
        state.cancel();
        return;
      }

      // begin auto-pan using cursor viewport position
      const screenPosition = { x: state.xy[0], y: state.xy[1] };
      autoPan.start(screenPosition);

      // capture the initial displacement between the cursor and the
      // object's center to add to each subsequent position
      const currentObjectPosition = canvas.getViewportPosition(objectId);
      if (currentObjectPosition) {
        const displacement = subtractVectors(
          currentObjectPosition,
          screenPosition,
        );
        grabDisplacementRef.current.x = displacement.x;
        grabDisplacementRef.current.y = displacement.y;
      }
      // apply displacement and begin drag
      // TODO: DELETE - canvas no longer controls object positions.
      // canvas.onObjectDragStart(displace(screenPosition), objectId);
      setIsGrabbing(true);
      const position = viewport.viewportToWorld(displace(screenPosition));
      dragSpring.start(position);
      onDragStart?.(position);
    },
    onDragEnd: (state) => {
      if (
        'button' in state.event &&
        (isRightClick(state.event) || isMiddleClick(state.event))
      ) {
        state.cancel();
        return;
      }

      const screenPosition = { x: state.xy[0], y: state.xy[1] };
      // TODO: DELETE - canvas no longer controls object positions.
      // canvas.onObjectDragEnd(displace(screenPosition), objectId);

      // animate to final position, rounded by canvas
      const position = canvas.snapPosition(
        viewport.viewportToWorld(displace(screenPosition)),
      );
      dragSpring.start(position);

      // we leave this flag on for a few ms - the "drag" gesture
      // basically has a fade-out effect where it continues to
      // block gestures internal to the drag handle for a bit even
      // after releasing
      setTimeout(() => {
        setIsGrabbing(false);
      }, 100);
      autoPan.stop();
      grabDisplacementRef.current = { x: 0, y: 0 };

      // invoke tap handler if provided. not sure how to type this..
      if (state.tap) {
        state.args?.[0]?.onTap?.(position);
      }

      onDragEnd?.(position);
    },
  });

  return {
    bindDragHandle,
    pickupSpring,
    isGrabbing,
    moveTo,
    dragSpring,
    dragStyle,
  };
}
