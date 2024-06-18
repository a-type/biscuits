import { clsx } from '@a-type/ui';
import { preventDefault } from '@a-type/utils';
import { useMergedRef } from '@biscuits/client';
import { animated, to, useSpring } from '@react-spring/web';
import {
  createContext,
  CSSProperties,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useIsSelected,
  useObjectGestures,
  useRegister,
} from './canvasHooks.js';
import { useCanvas } from './CanvasProvider.jsx';
import { SPRINGS } from './constants.js';
import {
  addVectors,
  snapshotLiveVector,
  vectorDistance,
  vectorLength,
} from './math.js';
import { useRerasterize } from './rerasterizeSignal.js';
import { Vector2 } from './types.js';
import { useGesture } from '@use-gesture/react';
import { CanvasGestureInfo } from './Canvas.js';

export interface CanvasObjectRootProps {
  children: ReactNode;
  className?: string;
  canvasObject: CanvasObject;
  onTap?: (info: CanvasGestureInfo) => void;
  style?: CSSProperties;
}

export function CanvasObjectRoot({
  children,
  className,
  canvasObject,
  onTap,
  style,
  ...rest
}: CanvasObjectRootProps) {
  const ref = useRef<HTMLDivElement>(null);
  useRerasterize(ref);
  useHideOffscreen(ref);

  const register = useRegister(canvasObject.id, canvasObject.metadata);
  const finalRef = useMergedRef(ref, register);

  const canvas = useCanvas();
  const bind = useGesture({
    onDragEnd: (info) => {
      if (info.tap) {
        console.debug(`claiming tap gesture for ${canvasObject.id}`);
        canvas.gestureState.claimedBy = canvasObject.id;
        onTap?.({
          alt: info.altKey,
          ctrlOrMeta: info.ctrlKey || info.metaKey,
          delta: canvas.viewport.viewportDeltaToWorld({
            x: info.delta[0],
            y: info.delta[1],
          }),
          intentional: true,
          shift: info.shiftKey,
          worldPosition: canvas.viewport.viewportToWorld({
            x: info.xy[0],
            y: info.xy[1],
          }),
          targetId: canvasObject.id,
        });
      }
    },
  });

  return (
    <CanvasObjectContext.Provider value={canvasObject}>
      <animated.div
        ref={finalRef}
        className={clsx('absolute touch-none', className)}
        // this is blocking undo keybinds...
        // onKeyDown={stopPropagation}
        // onKeyUp={stopPropagation}
        // onDragStart={preventDefault}
        // onDragEnd={preventDefault}
        // onDrag={preventDefault}
        {...canvasObject.rootProps}
        style={{
          ...style,
          ...canvasObject.rootProps.style,
        }}
        {...bind()}
        {...rest}
      >
        {children}
      </animated.div>
    </CanvasObjectContext.Provider>
  );
}

export interface CanvasObject {
  isDragging: boolean;
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

  const [isDragging, setIsDragging] = useState(false);
  const [positionStyle, positionSpring] = useSpring(() => initialPosition);

  const pickupSpring = useSpring({
    value: isDragging ? 1 : 0,
    config: SPRINGS.WOBBLY,
  });

  /**
   * ONLY MOVES THE VISUAL NODE.
   * Update the actual backing data to make real movements.
   * This should be hooked up to backing data changes.
   */
  const moveTo = useCallback(
    (position: Vector2) => {
      positionSpring.start({
        x: position.x,
        y: position.y,
      });
    },
    [objectId, positionSpring],
  );

  // FIXME: find a better place to do this?
  useEffect(
    () => canvas.bounds.registerOrigin(objectId, positionStyle),
    [canvas, objectId],
  );

  const { selected } = useIsSelected(objectId);

  useObjectGestures({
    onDragStart: (info) => {
      if (!selected && info.targetId !== objectId) return;
      positionSpring.set(
        addVectors(snapshotLiveVector(positionStyle), info.delta),
      );
      if (vectorLength(info.delta) > 5) {
        setIsDragging(true);
      }
    },
    onDrag: (info) => {
      if (!selected && info.targetId !== objectId) return;
      const finalPosition = addVectors(
        snapshotLiveVector(positionStyle),
        info.delta,
      );
      onDrag?.(finalPosition);
      positionSpring.set(finalPosition);
      if (vectorLength(info.delta) > 5) {
        setIsDragging(true);
      }
    },
    onDragEnd: async (info) => {
      if (!selected && info.targetId !== objectId) return;
      const finalPosition = canvas.snapPosition(
        addVectors(snapshotLiveVector(positionStyle), info.delta),
      );
      onDrop?.(finalPosition);
      // animate to final position
      positionSpring.start(finalPosition);
      // we leave this flag on for a few ms - the "drag" gesture
      // basically has a fade-out effect where it continues to
      // block gestures internal to the drag handle for a bit even
      // after releasing
      setTimeout(setIsDragging, 100, false);
      // update the spatial hash now that the object is settled
      canvas.bounds.updateHash(objectId);
    },
  });

  const canvasObject: CanvasObject = useMemo(() => {
    const rootProps = {
      style: {
        /**
         * Translate to the correct position, offset by origin,
         * and apply a subtle bouncing scale effect when picked
         * up or dropped.
         */
        transform: to(
          [positionStyle.x, positionStyle.y, pickupSpring.value],
          (xv, yv, grabEffect) =>
            `translate(${xv}px, ${yv}px) scale(${1 + 0.05 * grabEffect})`,
        ),
        zIndex,
        cursor: isDragging ? 'grab' : 'inherit',
      },
    };

    return {
      isDragging,
      rootProps,
      moveTo,
      id: objectId,
      metadata,
    };
  }, [canvas, pickupSpring, zIndex, isDragging, objectId]);

  return canvasObject;
}

function useHideOffscreen(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          ref.current?.style.setProperty('visibility', 'hidden');
        } else {
          ref.current?.style.setProperty('visibility', 'visible');
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);
}
