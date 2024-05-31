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

  return (
    <CanvasObjectContext.Provider value={canvasObject}>
      <animated.div
        ref={ref}
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
      </animated.div>
    </CanvasObjectContext.Provider>
  );
}

export interface CanvasObject {
  bindDragHandle: () => any;
  isGrabbing: boolean;
  rootProps: any;
  moveTo: (position: Vector2, interpolate?: boolean) => void;
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
  onDrop: onMove,
  zIndex = 0,
}: {
  initialPosition: Vector2;
  objectId: string;
  onDrop: (pos: Vector2) => any;
  zIndex?: number;
}) {
  const {
    style: dragStyle,
    pickupSpring,
    dragSpring,
    isGrabbing,
    bindDragHandle,
  } = useDrag({ initialPosition, objectId });

  /**
   * ONLY MOVES THE VISUAL NODE.
   * Update the actual backing data to make real movements.
   */
  const moveTo = useCallback(
    (position: Vector2, interpolate = true) => {
      dragSpring.start({
        x: position.x,
        y: position.y,
        immediate: !interpolate,
      });
    },
    [dragSpring],
  );

  const canvas = useCanvas();
  useEffect(() => {
    if (onMove) {
      return canvas.subscribe(`positionChange:${objectId}`, onMove);
    }
  }, [canvas, onMove]);

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
    };
  }, [dragStyle, pickupSpring, zIndex, isGrabbing, bindDragHandle]);

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

  const [style, spring] = useSpring(() => ({
    x: initialPosition.x,
    y: initialPosition.y,
    config: SPRINGS.RESPONSIVE,
  }));

  const pickupSpring = useSpring({
    value: isGrabbing ? 1 : 0,
    config: SPRINGS.WOBBLY,
  });

  // stores the displacement between the user's grab point and the position
  // of the object, in screen pixels
  const grabDisplacementRef = useRef<Vector2 | null>(null);
  const displace = useCallback((position: Vector2) => {
    return roundVector(
      addVectors(position, grabDisplacementRef.current ?? { x: 0, y: 0 }),
    );
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
  }, [autoPan, viewport, canvas, objectId, spring, displace]);

  useEffect(() => {
    return canvas.subscribe(`gestureChange:${objectId}`, (position) => {
      spring.start({
        x: position.x,
        y: position.y,
        immediate: true,
      });
    });
  }, [canvas]);

  // binds drag controls to the underlying element
  const bindDragHandle = useGesture({
    onDrag: (state) => {
      if (isRightClick(state.event) || isMiddleClick(state.event)) {
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

      const positionVector = displace({
        x: state.xy[0],
        y: state.xy[1],
      });

      // send to canvas to be interpreted into movement
      canvas.onObjectDrag(positionVector, objectId);

      autoPan.update({ x: state.xy[0], y: state.xy[1] });
    },
    onDragStart: (state) => {
      if (isRightClick(state.event) || isMiddleClick(state.event)) {
        state.cancel();
        return;
      }

      const screenPosition = { x: state.xy[0], y: state.xy[1] };

      // capture the initial displacement between the cursor and the
      // object's center to add to each subsequent position
      const currentPosition = viewport.worldToViewport({
        x: style.x.get(),
        y: style.y.get(),
      });
      grabDisplacementRef.current = subtractVectors(
        currentPosition,
        screenPosition,
      );
      const positionVector = displace(screenPosition);

      canvas.onObjectDragStart(positionVector, objectId);
      autoPan.start(screenPosition);
      onDragStart?.();
    },
    onDragEnd: (state) => {
      if (isRightClick(state.event) || isMiddleClick(state.event)) {
        state.cancel();
        return;
      }

      const positionVector = displace({ x: state.xy[0], y: state.xy[1] });
      canvas.onObjectDragEnd(positionVector, objectId);
      // we leave this flag on for a few ms - the "drag" gesture
      // basically has a fade-out effect where it continues to
      // block gestures internal to the drag handle for a bit even
      // after releasing
      setTimeout(() => {
        setIsGrabbing(false);
      }, 100);
      autoPan.stop();
      onDragEnd?.();
      grabDisplacementRef.current = { x: 0, y: 0 };
    },
  });

  return {
    style,
    bindDragHandle,
    pickupSpring,
    isGrabbing,
    moveTo,
    dragSpring: spring,
  };
}
