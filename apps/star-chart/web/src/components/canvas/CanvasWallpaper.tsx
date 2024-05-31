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
  color = 'var(--color-accent-light)',
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
        'absolute rounded-lg [background-position:center] bg-repeat z-0',
        '[background-size:40px_40px] [background-image:linear-gradient(to_right,_var(--color-accent-dark)_1px,_transparent_1px),linear-gradient(to_bottom,_var(--color-accent-dark)_1px,_transparent_1px)]',
      )}
    >
      {children}
    </div>
  );
};
