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

  const canvas = useCanvas();
  const observe = useCallback(
    (el: HTMLElement | null) => {
      return canvas.bounds.observe(canvasObject.id, el);
    },
    [canvas, canvasObject.id],
  );

  const finalRef = useMergedRef(ref, observe);

  return (
    <CanvasObjectContext.Provider value={canvasObject}>
      <animated.div
        ref={finalRef}
        className={clsx('absolute', className)}
        onKeyDown={stopPropagation}
        onKeyUp={stopPropagation}
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

function DebugAnnotations() {
  const canvas = useCanvas();
  const { id } = useCanvasObjectContext();
  const size = canvas.getLiveBounds(id);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <animated.div
        className="absolute left-0 top-0 border-solid border-1 border-red"
        style={{
          width: size.width,
          height: size.height,
        }}
      />
      <animated.div
        className="w-1px h-1px left-0 top-0 absolute z-1 bg-red rounded-full"
        style={{
          x: size.width.to((w) => w / 2),
          y: size.height.to((h) => h / 2),
        }}
      />
    </div>
  );
}

export interface CanvasObject {
  bindDragHandle: (args?: { onTap?: () => void }) => any;
  isGrabbing: boolean;
  rootProps: any;
  moveTo: (position: Vector2, interpolate?: boolean) => void;
  id: string;
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
}: {
  initialPosition: Vector2;
  objectId: string;
  onDrop: (pos: Vector2) => any;
  zIndex?: number;
}) {
  const canvas = useCanvas();

  const { pickupSpring, isGrabbing, bindDragHandle } = useDrag({
    initialPosition,
    objectId,
  });

  /**
   * ONLY MOVES THE VISUAL NODE.
   * Update the actual backing data to make real movements.
   * This should be hooked up to backing data changes.
   */
  const moveTo = useCallback(
    (position: Vector2) => {
      canvas.setPosition(objectId, {
        x: position.x,
        y: position.y,
      });
    },
    [canvas, objectId],
  );

  useEffect(() => {
    if (onDrop) {
      return canvas.subscribe(`gestureCommit:${objectId}`, onDrop);
    }
  }, [canvas, onDrop]);

  const canvasObject: CanvasObject = useMemo(() => {
    const position = canvas.positions.get(objectId);
    const rootProps = {
      style: {
        /**
         * Translate to the correct position, offset by origin,
         * and apply a subtle bouncing scale effect when picked
         * up or dropped.
         */
        transform: to(
          [position.x, position.y, pickupSpring.value],
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
    };
  }, [canvas, pickupSpring, zIndex, isGrabbing, bindDragHandle, objectId]);

  return canvasObject;
}

function useDrag({
  initialPosition,
  objectId,
  onDragStart,
  onDragEnd,
}: {
  initialPosition: Vector2;
  objectId: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const canvas = useCanvas();
  const viewport = useViewport();

  const [isGrabbing, setIsGrabbing] = useState(false);

  useEffectOnce(() => {
    canvas.setPosition(objectId, initialPosition);
  });

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
        const finalPosition = displace(cursorPosition);
        canvas.onObjectDrag(finalPosition, objectId);
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

      // send to canvas to be interpreted into movement
      canvas.onObjectDrag(displace(screenPosition), objectId);
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
      canvas.onObjectDragStart(displace(screenPosition), objectId);
      onDragStart?.();
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
      canvas.onObjectDragEnd(displace(screenPosition), objectId);
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
        console.log('tap');
        state.args?.[0]?.onTap?.();
      } else {
        onDragEnd?.();
      }
    },
  });

  return {
    bindDragHandle,
    pickupSpring,
    isGrabbing,
    moveTo,
  };
}
