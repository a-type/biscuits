import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Canvas, CanvasGestureInfo, CanvasOptions } from './Canvas.js';
import { Viewport } from './Viewport.js';
import { useViewport } from './ViewportProvider.jsx';
import { Vector2 } from './types.js';
import { useCanvasGestures } from './canvasHooks.js';

// A 'default' implementation of CanvasContext which essentially does nothing,
// might assist in easier isolated rendering of canvas-dependent components
const dummyCanvas = new Canvas(new Viewport({}));

export const CanvasContext = createContext<Canvas>(dummyCanvas);

/**
 * Abstractly, a CanvasProvider provides a way of handling changes to object positions,
 * including the act of moving an object and that of releasing it to a final location.
 */
export const CanvasProvider = ({
  children,
  options,
}: {
  children: ReactNode;
  options?: CanvasOptions;
}) => {
  const viewport = useViewport();
  const [canvas] = useState(() => {
    return new Canvas(viewport, options);
  });
  return (
    <CanvasContext.Provider value={canvas}>{children}</CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);

// FIXME: this is silly, clean this pattern up
export function CanvasGestures(props: Parameters<typeof useCanvasGestures>[0]) {
  useCanvasGestures(props);
  return null;
}
