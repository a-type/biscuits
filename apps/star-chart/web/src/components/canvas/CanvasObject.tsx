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
import { useViewport } from './ViewportRoot.jsx';
import { to, useSpring, animated } from '@react-spring/web';
import { Vector2 } from './types.js';
import { SPRINGS } from './constants.js';
import {
  addVectors,
  roundVector,
  snapshotLiveVector,
  subtractVectors,
} from './math.js';
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
import {
  useIsSelected,
  useObjectGestures,
  useRegister,
} from './canvasHooks.js';

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
      if (info.intentional) {
        setIsDragging(true);
      }
    },
    onDrag: (info) => {
      if (!selected && info.targetId !== objectId) return;
      onDrag?.(info.worldPosition);
      positionSpring.set(
        addVectors(snapshotLiveVector(positionStyle), info.delta),
      );
      if (info.intentional) {
        setIsDragging(true);
      }
    },
    onDragEnd: async (info) => {
      if (!selected && info.targetId !== objectId) return;
      onDrop?.(info.worldPosition);
      // animate to final position
      positionSpring.start(
        canvas.snapPosition(
          addVectors(snapshotLiveVector(positionStyle), info.delta),
        ),
      );
      // we leave this flag on for a few ms - the "drag" gesture
      // basically has a fade-out effect where it continues to
      // block gestures internal to the drag handle for a bit even
      // after releasing
      setTimeout(setIsDragging, 100, false);
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
