import { ReactNode, useMemo } from 'react';
import { useViewport } from './ViewportProvider.jsx';
import { clsx } from '@a-type/ui';
import { createPortal } from 'react-dom';

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
  const viewport = useViewport();
  const canvasRect = viewport.canvasRect;

  const style = useMemo(() => {
    return {
      width: viewport.canvasRect.width,
      height: viewport.canvasRect.height,
      left: viewport.canvasRect.x,
      top: viewport.canvasRect.y,
    };
  }, [viewport]);

  return (
    <svg
      className={clsx(
        'absolute pointer-events-none [&>*]:pointer-events-auto',
        className,
      )}
      style={style}
      id={id}
      viewBox={`-${canvasRect.width / 2} -${canvasRect.height / 2} ${canvasRect.width} ${canvasRect.height}`}
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
