import { clsx } from '@a-type/ui';
import * as React from 'react';
import { useCanvasRect } from './canvasHooks.js';

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
}) => {
  const canvasRect = useCanvasRect();

  const style = React.useMemo(() => {
    return {
      backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
      width: canvasRect.width,
      height: canvasRect.height,
      left: 0,
      top: 0,
      transform: `translate(-50%, -50%)`,
    };
  }, [imageUrl, canvasRect]);

  return (
    <div
      style={style}
      className={clsx(
        'absolute rounded-lg [background-position:14px_14px] bg-repeat z-0 touch-none opacity-10',
        classNameGridBg,
      )}
    >
      {children}
    </div>
  );
};

const classNameGridBg =
  '[background-size:var(--grid-size,24px)_var(--grid-size,24px)] [background-image:linear-gradient(to_right,_var(--color-dark-blend)_calc(1px/var(--zoom,1)),_transparent_calc(1px/var(--zoom,1))),linear-gradient(to_bottom,_var(--color-dark-blend)_calc(1px/var(--zoom,1)),_transparent_calc(1px/var(--zoom,1)))]';
