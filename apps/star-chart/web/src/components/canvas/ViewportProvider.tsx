import { createContext, useCallback, useRef, useState } from 'react';
import { Viewport } from './Viewport.js';
import { useContext } from 'react';
import {
  useKeyboardControls,
  useViewportGestureControls,
} from './viewportHooks.js';
import { clsx } from '@a-type/ui';
import { Size } from './types.js';

export function useViewport() {
  const ctx = useContext(ViewportContext);
  if (!ctx)
    throw new Error('useViewport must be called inside a ViewportProvider');
  return ctx;
}

export const ViewportContext = createContext<Viewport | null>(null);

export interface ViewportProviderProps {
  children?: React.ReactNode;
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  canvasSize?: Size | null;
}

export const ViewportProvider = ({
  children,
  minZoom = 1 / 4,
  maxZoom = 2,
  defaultZoom = 1,
  canvasSize = { width: 2000, height: 2000 },
}: ViewportProviderProps) => {
  const [viewport] = useState(() => {
    const viewport = new Viewport({
      panLimitMode: 'viewport',
      defaultZoom,
      zoomLimits: {
        min: minZoom,
        max: maxZoom,
      },
      canvasLimits: canvasSize
        ? {
            max: { x: canvasSize.width / 2, y: canvasSize.height / 2 },
            min: { x: -canvasSize.width / 2, y: -canvasSize.height / 2 },
          }
        : undefined,
    });
    // @ts-ignore for debugging!
    window.viewport = viewport;
    return viewport;
  });

  return (
    <ViewportContext.Provider value={viewport}>
      {children}
    </ViewportContext.Provider>
  );
};

export const ViewportRoot = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const viewport = useViewport();
  const ref = useRef<HTMLDivElement>(null);

  const viewportProps = useViewportGestureControls(viewport, ref);

  const keyboardProps = useKeyboardControls(viewport);

  const finalRef = useMergedRefs(ref, keyboardProps.ref, viewport.bindElement);

  return (
    <div
      className={clsx(
        'w-full h-full flex-1 overflow-hidden select-none cursor-move relative touch-none contain-strict',
        className,
      )}
      {...viewportProps}
      {...keyboardProps}
      ref={finalRef}
    >
      {children}
    </div>
  );
};

function useMergedRefs<T>(...refs: React.Ref<T>[]) {
  return useCallback((value: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  }, refs);
}
