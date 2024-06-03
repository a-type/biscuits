import { useEffect, useMemo } from 'react';
import { useCanvas } from './CanvasProvider.jsx';
import { useViewport } from './ViewportProvider.jsx';
import { animated, useSpring } from '@react-spring/web';
import { clsx } from '@a-type/ui';
import { useGesture } from '@use-gesture/react';
import { useBoundsObjectIds, useOrigin, useSize } from './canvasHooks.js';

export interface MinimapProps {
  className?: string;
}

export function Minimap({ className }: MinimapProps) {
  const viewport = useViewport();

  const bind = useGesture({
    onDrag: ({ event }) => {
      event.stopPropagation();
      if ('clientX' in event) {
        const svg = event.target as SVGSVGElement;
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const cursor = point.matrixTransform(svg.getScreenCTM()?.inverse());

        viewport.doPan(cursor);
      }
    },
  });

  const ids = useBoundsObjectIds();
  console.log(ids);

  return (
    <div className={className}>
      <svg
        viewBox={`${-viewport.canvasRect.width / 2} ${-viewport.canvasRect.height / 2} ${viewport.canvasRect.width} ${viewport.canvasRect.height}`}
        // preserve aspect ratio
        // style={{
        //   aspectRatio: `${viewport.canvasRect.width} / ${viewport.canvasRect.height}`,
        // }}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        {...bind()}
      >
        {ids.map((id) => (
          <MinimapRect key={id} objectId={id} />
        ))}
        <MinimapViewportRect />
      </svg>
    </div>
  );
}

function MinimapRect({ objectId }: { objectId: string }) {
  const origin = useOrigin(objectId);
  const size = useSize(objectId);

  return (
    <animated.rect
      x={origin.x}
      y={origin.y}
      width={size.width}
      height={size.height}
      fill="transparent"
      stroke="black"
      strokeWidth={1}
      pointerEvents="none"
    />
  );
}

function MinimapViewportRect() {
  const viewport = useViewport();
  const [{ x, y, width, height }, spring] = useSpring(() => ({
    x: viewport.topLeft.x,
    y: viewport.topLeft.y,
    width: viewport.size.width,
    height: viewport.size.height,
  }));

  useEffect(() => {
    function update() {
      spring.start({
        x: viewport.topLeft.x,
        y: viewport.topLeft.y,
        width: viewport.size.width,
        height: viewport.size.height,
      });
    }
    const unsubs = [
      viewport.subscribe('centerChanged', update),
      viewport.subscribe('sizeChanged', update),
      viewport.subscribe('zoomChanged', update),
    ];
    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [viewport, spring]);

  return (
    <animated.rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="transparent"
      stroke="black"
      strokeWidth={1}
      pointerEvents="none"
    />
  );
}
