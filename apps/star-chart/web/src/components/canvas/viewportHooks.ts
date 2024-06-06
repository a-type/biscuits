import { hooks } from '@/store.js';
import { useGesture } from '@use-gesture/react';
import {
  KeyboardEvent as ReactKeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useCanvas } from './CanvasProvider.jsx';
import { Vector2 } from './types.js';
import { Viewport } from './Viewport.js';
import { vectorLength } from './math.js';
import { gestureStateToInput } from './gestureUtils.js';

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

const PINCH_GESTURE_DAMPING = 200;
const WHEEL_GESTURE_DAMPING = 100;

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
      onPinch: ({ da: [d], origin, memo, last }) => {
        if (memo === undefined) return d;
        const diff = d - memo;
        if (diff !== 0) {
          viewport.doRelativeZoom(diff / PINCH_GESTURE_DAMPING, {
            origin: 'direct',
            centroid: { x: origin[0], y: origin[1] },
            gestureComplete: last,
          });
        }
        return d;
      },
      onWheel: ({ delta: [x, y], event, last, metaKey, ctrlKey }) => {
        // if (isPinching.current) return;
        if (ctrlKey || metaKey) {
          viewport.doRelativeZoom(-y / WHEEL_GESTURE_DAMPING, {
            origin: 'direct',
            centroid: { x: event.clientX, y: event.clientY },
            gestureComplete: last,
          });
        } else {
          viewport.doRelativePan(
            viewport.viewportDeltaToWorld({
              x,
              y,
            }),
            {
              origin: 'direct',
              gestureComplete: true,
            },
          );
        }
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
        preventDefault: true,
      },
      wheel: {
        preventDefault: true,
      },
      eventOptions: {
        passive: false,
      },
    },
  );

  const onCursorMove = useTrackCursor(viewport);

  const canvas = useCanvas();

  const gestureDetails = useRef({
    buttons: 0,
    touches: 0,
  });
  const bindPassiveGestures = useGesture(
    {
      onDrag: (state) => {
        gestureDetails.current.touches =
          state.type === 'touchmove' ? state.touches : 0;
        gestureDetails.current.buttons = state.buttons;

        const input = gestureStateToInput(state);
        if (isCanvasDrag(gestureDetails.current)) {
          if (!state.last) {
            canvas.onCanvasDrag(input);
          }
        } else {
          viewport.doRelativePan(
            viewport.viewportDeltaToWorld({
              x: -state.delta[0],
              y: -state.delta[1],
            }),
            {
              origin: 'direct',
              gestureComplete: state.last,
            },
          );
        }
      },
      onPointerMoveCapture: ({ event }) => {
        onCursorMove({ x: event.clientX, y: event.clientY });
      },
      onDragStart: (state) => {
        gestureDetails.current.touches =
          state.type === 'touchdown' ? state.touches : 0;
        gestureDetails.current.buttons = state.buttons;

        if (isCanvasDrag(gestureDetails.current)) {
          canvas.onCanvasDragStart(gestureStateToInput(state));
          return;
        }
      },
      onDragEnd: (state) => {
        const info = gestureStateToInput(state);

        // tap is triggered either by left click, or on touchscreens.
        // tap must fire before drag end.
        if (
          state.tap &&
          (isCanvasDrag(gestureDetails.current) || state.type === 'touchend')
        ) {
          canvas.onCanvasTap(info);
        }

        if (isCanvasDrag(gestureDetails.current)) {
          canvas.onCanvasDragEnd(info);
        }

        gestureDetails.current.buttons = 0;
        gestureDetails.current.touches = 0;
      },
      onContextMenu: ({ event }) => {
        event.preventDefault();
      },
    },
    {
      drag: {
        pointer: {
          buttons: [1, 2, 4],
          // enabling touch events on mobile devices makes it possible
          // to differentiate between touch and non-touch events.
          touch: true,
          // lock: true,
        },
      },
    },
  );

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
  const activeKeysRef = useRef({
    pressed: new Set<string>(),
    released: new Set<string>(),
  });

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
        activeKeysRef.current.pressed.add(ev.key);
      }
    }
  }, []);

  const handleKeyUp = useCallback((ev: ReactKeyboardEvent<HTMLElement>) => {
    if (CONTROLLED_KEYS.includes(ev.key)) {
      ev.preventDefault();
      activeKeysRef.current.pressed.delete(ev.key);
      activeKeysRef.current.released.add(ev.key);
      queueMicrotask(() => {
        activeKeysRef.current.released.delete(ev.key);
      });
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

      if (activeKeys.pressed.has('=') || activeKeys.pressed.has('+')) {
        viewport.doRelativeZoom(delta * ZOOM_SPEED, {
          origin: 'direct',
          gestureComplete: true,
        });
      } else if (activeKeys.pressed.has('-')) {
        viewport.doRelativeZoom(delta * -ZOOM_SPEED, {
          origin: 'direct',
          gestureComplete: true,
        });
      }
      const xInput = activeKeys.pressed.has('ArrowLeft')
        ? -1
        : activeKeys.pressed.has('ArrowRight')
          ? 1
          : 0;
      const yInput = activeKeys.pressed.has('ArrowUp')
        ? -1
        : activeKeys.pressed.has('ArrowDown')
          ? 1
          : 0;
      velocity.x = delta * xInput * PAN_SPEED;
      velocity.y = delta * yInput * PAN_SPEED;
      if (velocity.x !== 0 || velocity.y !== 0) {
        viewport.doRelativePan(velocity, {
          origin: 'direct',
          gestureComplete: true,
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

function isCanvasDrag({
  touches,
  buttons,
}: {
  touches: number;
  buttons: number;
}) {
  return !!(buttons & 1) && touches === 0;
}
