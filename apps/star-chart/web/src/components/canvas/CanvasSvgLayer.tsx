import { ReactNode, useMemo, useRef } from 'react';
import { clsx } from '@a-type/ui';
import { createPortal } from 'react-dom';
import { useCanvasRect } from './canvasHooks.js';
import { useCanvas } from './CanvasProvider.jsx';
import { useRerasterize } from './rerasterizeSignal.js';

export interface CanvasSvgLayerProps {
  children: ReactNode;
  className?: string;
  id: string;
}

export function CanvasSvgLayer({
  children,
  className,
  id,
}: CanvasSvgLayerProps) {
  const canvas = useCanvas();
  const canvasRect = useCanvasRect();

  const style = useMemo(() => {
    return {
      width: canvas.boundary.width,
      height: canvas.boundary.height,
      left: canvas.boundary.x,
      top: canvas.boundary.y,
    };
  }, [canvas]);

  const ref = useRef<SVGSVGElement>(null);
  useRerasterize(ref);

  return (
    <svg
      className={clsx(
        'absolute pointer-events-none [&>*]:pointer-events-auto',
        className,
      )}
      style={style}
      id={id}
      viewBox={`-${canvasRect.width / 2} -${canvasRect.height / 2} ${canvasRect.width} ${canvasRect.height}`}
      ref={ref}
    >
      {children}
    </svg>
  );
}

export function SvgPortal({
  children,
  layerId,
}: {
  children: ReactNode;
  layerId: string;
}) {
  const layer = document.getElementById(layerId);
  if (!layer) {
    console.debug('Layer not found', layerId);
    return null;
  }
  return createPortal(children, layer);
}
