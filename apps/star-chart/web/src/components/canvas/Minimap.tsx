import { animated, useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { useEffect, JSX, Fragment } from 'react';
import { useBoundsObjectIds, useOrigin, useSize } from './canvasHooks.js';
import { useViewport } from './ViewportProvider.jsx';
import { useCanvas } from './CanvasProvider.jsx';
import { useCanvasRect } from './viewportHooks.js';

export interface MinimapProps {
  className?: string;
  renderItem?: (objectId: string, metadata: any) => JSX.Element | null;
}

export function Minimap({ className, renderItem }: MinimapProps) {
  const viewport = useViewport();
  const canvas = useCanvas();

  const canvasRect = useCanvasRect();

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

  return (
    <div className={className}>
      <animated.svg
        viewBox={`${-canvasRect.width / 2} ${-canvasRect.height / 2} ${canvasRect.width} ${canvasRect.height}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        {...bind()}
      >
        {ids.map((id) =>
          renderItem ? (
            <Fragment key={id}>
              {renderItem(id, canvas.objectMetadata.get(id))}
            </Fragment>
          ) : (
            <MinimapRect key={id} objectId={id} />
          ),
        )}
        <MinimapViewportRect />
      </animated.svg>
    </div>
  );
}

export function MinimapRect({
  objectId,
  className,
}: {
  objectId: string;
  className?: string;
}) {
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
      className={className}
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
