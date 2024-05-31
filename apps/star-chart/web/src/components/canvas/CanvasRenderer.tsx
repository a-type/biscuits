import { animated, to, useSpring } from '@react-spring/web';
import { SPRINGS } from './constants.js';
import { Vector2 } from './types.js';
import { rerasterizeSignal } from './rerasterizeSignal.js';
import { useViewport } from './ViewportProvider.jsx';
import { ViewportEventOrigin } from './Viewport.js';
import { ReactNode, useEffect, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import { PresenceCursors } from './PresenceCursors.jsx';
import { useCanvas } from './CanvasProvider.jsx';

const VIEWPORT_ORIGIN_SPRINGS = {
  control: SPRINGS.QUICK,
  animation: SPRINGS.RELAXED,
  // not actually used, for direct we do immediate:true to disable
  // easing
  direct: SPRINGS.RESPONSIVE,
};

export interface IViewportRendererProps {
  children?: ReactNode;
  onZoomChange?: (zoom: number) => void;
  onTap?: (position: Vector2) => void;
}

export const CanvasRenderer = ({
  children,
  onZoomChange,
  onTap,
}: IViewportRendererProps) => {
  const viewport = useViewport();

  // keep track of viewport element size as provided by Viewport class
  const [viewportSize, setViewportSize] = useState(viewport.size);
  useEffect(() => {
    return viewport.subscribe('sizeChanged', setViewportSize);
  }, [viewport]);

  // the main spring which controls the Canvas transformation.
  // X/Y position is in World Space - i.e. the coordinate space
  // is not affected by the zoom
  const [{ centerX, centerY }, panSpring] = useSpring(() => ({
    centerX: viewport.center.x,
    centerY: viewport.center.y,
    isPanning: false,
    config: SPRINGS.RELAXED,
  }));
  const [{ zoom }, zoomSpring] = useSpring(() => ({
    zoom: viewport.zoom,
    isZooming: false,
    config: SPRINGS.RELAXED,
  }));

  useEffect(() => {
    async function handleCenterChanged(
      center: Readonly<Vector2>,
      origin: ViewportEventOrigin,
    ) {
      await panSpring.start({
        centerX: center.x,
        centerY: center.y,
        isPanning: true,
        immediate: origin === 'direct',
        config: VIEWPORT_ORIGIN_SPRINGS[origin],
      })[0];
      await panSpring.start({ isPanning: false })[0];
    }
    async function handleZoomChanged(
      zoomValue: number,
      origin: ViewportEventOrigin,
    ) {
      onZoomChange?.(zoomValue);
      await zoomSpring.start({
        zoom: zoomValue,
        isZooming: true,
        immediate: origin === 'direct',
        config: VIEWPORT_ORIGIN_SPRINGS[origin],
      })[0];
      await zoomSpring.start({ isZooming: false })[0];
      rerasterizeSignal.emit('rerasterize');
    }
    const unsubs = [
      viewport.subscribe('centerChanged', handleCenterChanged),
      viewport.subscribe('zoomChanged', handleZoomChanged),
    ];
    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [viewport, panSpring, zoomSpring, onZoomChange]);

  const bindGestures = useGesture({
    onDragEnd: ({ tap, xy: [x, y] }) => {
      if (tap) {
        onTap?.(
          viewport.viewportToWorld({
            x,
            y,
          }),
        );
      }
    },
  });

  const canvas = useCanvas();

  return (
    <animated.div
      className="absolute origin-center overflow-visible overscroll-none touch-none"
      style={{
        transform: to([centerX, centerY, zoom], (cx, cy, zoomv) => {
          // 1. Translate the center of the canvas to 0,0 (-halfCanvasWidth, -halfCanvasHeight)
          // 2. Translate that center point back to the center of the screen (+viewport.size.width / 2, +viewport.size.height / 2)
          // 3. Scale up (or down) to the specified zoom value
          // 4. Translate the center according to the pan position
          return `translate(${viewportSize.width / 2}px, ${
            viewportSize.height / 2
          }px) scale(${zoomv}, ${zoomv}) translate(${-cx}px, ${-cy}px)`;
        }),
        // @ts-ignore
        '--zoom': zoom,
        // @ts-ignore
        '--grid-size': `${canvas.snapIncrement > 1 ? canvas.snapIncrement : 24}px`,
      }}
      {...bindGestures()}
    >
      {children}
      <PresenceCursors />
    </animated.div>
  );
};
