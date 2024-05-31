import { createContext, ReactNode, useContext, useState } from 'react';
import { Canvas, CanvasOptions } from './Canvas.js';
import { Viewport } from './Viewport.js';
import { useViewport } from './ViewportProvider.jsx';

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
