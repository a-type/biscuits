import { clsx } from '@a-type/ui';
import * as React from 'react';
import { useViewport } from './ViewportProvider.jsx';

export interface IViewportWallpaperProps {
  children?: React.ReactNode;
  imageUrl?: string | null;
  color?: string;
}

/**
 * Renders a wallpaper inside a viewport which stretches to the bounds of the
 * enclosed canvas.
 */
export const CanvasWallpaper: React.FC<IViewportWallpaperProps> = ({
  children,
  imageUrl,
  color = 'var(--color-wash)',
}) => {
  const viewport = useViewport();

  const style = React.useMemo(() => {
    const canvasRect = viewport.canvasRect;
    return {
      backgroundColor: color,
      backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
      width: canvasRect.width,
      height: canvasRect.height,
      left: canvasRect.x,
      top: canvasRect.y,
    };
  }, [imageUrl, color, viewport]);

  return (
    <div
      style={style}
      className={clsx(
        'absolute rounded-lg [background-position:calc(var(--grid-size,24px)/-2)_calc(var(--grid-size,24px)/-2)] bg-repeat z-0',
        classNameGridBg,
      )}
    >
      {children}
    </div>
  );
};

const classNameGridBg =
  '[background-size:var(--grid-size,24px)_var(--grid-size,24px)] [background-image:linear-gradient(to_right,_var(--color-gray-3)_calc(1px/var(--zoom,1)),_transparent_calc(1px/var(--zoom,1))),linear-gradient(to_bottom,_var(--color-gray-3)_calc(1px/var(--zoom,1)),_transparent_calc(1px/var(--zoom,1)))]';
