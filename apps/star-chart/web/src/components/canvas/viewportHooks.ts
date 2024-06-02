import { hooks } from '@/store.js';
import { useGesture } from '@use-gesture/react';
import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { proxy } from 'valtio';
import { Vector2 } from './types.js';
import { Viewport } from './Viewport.js';
import { isLeftClick } from '@a-type/utils';

/**
 * Tracks cursor position and sends updates to the socket connection
 */
export function useTrackCursor(viewport: Viewport) {
  const lastKnownPositionRef = useRef<Vector2>({ x: 0, y: 0 });

  const client = hooks.useClient();

  const onMove = useCallback(
    (pos: Vector2) => {
      lastKnownPositionRef.current = pos;
      client.sync.presence.update({
        cursorPosition: viewport.viewportToWorld(lastKnownPositionRef.current),
        cursorActive: true,
      });
    },
    [lastKnownPositionRef, client, viewport],
  );

  useEffect(() => {
    const handleWindowBlur = () => {
      client.sync.presence.update({
        cursorActive: false,
      });
    };
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [lastKnownPositionRef]);

  useEffect(() => {
    const unsubs = [
      viewport.subscribe('centerChanged', () => {
        onMove(lastKnownPositionRef.current);
      }),
      viewport.subscribe('sizeChanged', () => {
        onMove(lastKnownPositionRef.current);
      }),
      viewport.subscribe('zoomChanged', () => {
        onMove(lastKnownPositionRef.current);
      }),
    ];
    return () => {
      unsubs.forEach((fn) => fn());
    };
  }, [viewport, onMove]);

  return onMove;
}

export const viewportGestureState = proxy({
  active: false,
});

const PINCH_GESTURE_DAMPING = 200;
const WHEEL_GESTURE_DAMPING = 40;

export interface ViewportGestureConfig {
  initialZoom: number;
}

export function useViewportGestureControls(
  viewport: Viewport,
  ref: RefObject<HTMLElement>,
) {
  const initialZoom = viewport.config.defaultZoom;
  // active is required to prevent default behavior, which
  // we want to do for zoom.
  useGesture(
    {
      onPinch: ({ da: [d], origin, event, memo }) => {
        event?.preventDefault();
        if (memo === undefined) return d;
        const diff = d - memo;
        if (diff !== 0) {
          viewport.doRelativeZoom(diff / PINCH_GESTURE_DAMPING, {
            origin: 'direct',
            centroid: { x: origin[0], y: origin[1] },
          });
        }
        return d;
      },
      onWheel: ({ delta: [x, y], event }) => {
        event?.preventDefault();
        if (event?.ctrlKey || event?.metaKey) {
          viewport.doRelativeZoom(-y / WHEEL_GESTURE_DAMPING, {
            origin: 'direct',
            centroid: { x: event.clientX, y: event.clientY },
          });
        } else {
          viewport.doRelativePan(
            viewport.viewportDeltaToWorld({
              x,
              y,
            }),
            {
              origin: 'direct',
            },
          );
        }
      },
      onPinchStart: ({ event }) => {
        event?.preventDefault();
        viewportGestureState.active = true;
      },
      onPinchEnd: ({ event }) => {
        event?.preventDefault();
        viewportGestureState.active = false;
      },
      onWheelStart: ({ event }) => {
        event?.preventDefault();
        viewportGestureState.active = true;
      },
      onWheelEnd: ({ event }) => {
        event?.preventDefault();
        viewportGestureState.active = false;
      },
    },
    {
      target: ref,
      // keeps the pinch gesture within our min/max zoom bounds,
      // without this you can pinch 'more' than the zoom allows,
      // creating weird deadzones at min and max values where
      // you have to keep pinching to get 'back' into the allowed range
      pinch: {
        scaleBounds: {
          min:
            (viewport.config.zoomLimits.min - initialZoom) *
            PINCH_GESTURE_DAMPING,
          max:
            (viewport.config.zoomLimits.max - initialZoom) *
            PINCH_GESTURE_DAMPING,
        },
      },
      eventOptions: {
        passive: false,
      },
    },
  );

  const onCursorMove = useTrackCursor(viewport);

  const bindPassiveGestures = useGesture({
    onDrag: ({ delta: [x, y], event }) => {
      if ('button' in event && isLeftClick(event)) {
        // ignore left-click drags for panning.
        // TODO: box-select
        return;
      }
      viewport.doRelativePan(viewport.viewportDeltaToWorld({ x: -x, y: -y }), {
        origin: 'direct',
      });
    },
    onPointerMoveCapture: ({ event }) => {
      onCursorMove({ x: event.clientX, y: event.clientY });
    },
    onDragStart: () => {
      viewportGestureState.active = true;
    },
    onDragEnd: () => {
      viewportGestureState.active = false;
    },
  });

  return bindPassiveGestures();
}

const CONTROLLED_KEYS = [
  '=',
  '+',
  '-',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
];
const PAN_SPEED = 1;
const ZOOM_SPEED = 0.001;

export function useKeyboardControls(viewport: Viewport) {
  const elementRef = useRef<HTMLDivElement>(null);
  const activeKeysRef = useRef(new Set<string>());

  // global zoom default prevention - this is best-effort and not
  // guaranteed to work.
  useEffect(() => {
    const onGlobalKeyDown = (ev: KeyboardEvent) => {
      if ((ev.metaKey || ev.ctrlKey) && (ev.key === '=' || ev.key === '-')) {
        ev.preventDefault();
      }
    };
    window.addEventListener('keydown', onGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', onGlobalKeyDown);
    };
  }, []);

  const handleKeyDown = useCallback((ev: ReactKeyboardEvent<HTMLElement>) => {
    if (CONTROLLED_KEYS.includes(ev.key)) {
      ev.preventDefault();
      // ignoring presses with metaKey because of behavior with MacOS -
      // if meta key is down, keyup is never fired and the zoom never
      // ends.
      if (!ev.metaKey) {
        activeKeysRef.current.add(ev.key);
      }
    }
  }, []);

  const handleKeyUp = useCallback((ev: ReactKeyboardEvent<HTMLElement>) => {
    if (CONTROLLED_KEYS.includes(ev.key)) {
      ev.preventDefault();
      activeKeysRef.current.delete(ev.key);
    }
  }, []);

  useEffect(() => {
    const { current: el } = elementRef;
    if (!el) return;

    // begin a loop which tracks delta time and applies it to
    // pan velocity for smooth panning regardless of framerate
    let lastFrameTime: number | null = null;
    let animationFrame: number | null = null;

    // extracted to reduce memory allocation in tight loop
    const velocity: Vector2 = { x: 0, y: 0 };

    function loop() {
      const activeKeys = activeKeysRef.current;
      const now = Date.now();
      const delta = lastFrameTime ? now - lastFrameTime : 0;
      lastFrameTime = now;

      if (activeKeys.has('=') || activeKeys.has('+')) {
        viewport.doRelativeZoom(delta * ZOOM_SPEED, {
          origin: 'direct',
        });
      } else if (activeKeys.has('-')) {
        viewport.doRelativeZoom(delta * -ZOOM_SPEED, {
          origin: 'direct',
        });
      }
      const xInput = activeKeys.has('ArrowLeft')
        ? -1
        : activeKeys.has('ArrowRight')
          ? 1
          : 0;
      const yInput = activeKeys.has('ArrowUp')
        ? -1
        : activeKeys.has('ArrowDown')
          ? 1
          : 0;
      velocity.x = delta * xInput * PAN_SPEED;
      velocity.y = delta * yInput * PAN_SPEED;
      if (velocity.x !== 0 || velocity.y !== 0) {
        viewport.doRelativePan(velocity, {
          origin: 'direct',
        });
      }

      animationFrame = requestAnimationFrame(loop);
    }
    // start the loop
    animationFrame = requestAnimationFrame(loop);

    return () => {
      animationFrame && cancelAnimationFrame(animationFrame);
    };
  }, [viewport]);

  return {
    tabIndex: 1,
    ref: elementRef,
    onKeyUp: handleKeyUp,
    onKeyDown: handleKeyDown,
  };
}
