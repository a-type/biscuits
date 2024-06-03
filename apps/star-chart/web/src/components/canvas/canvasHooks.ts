import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCanvas } from './CanvasProvider.jsx';
import { to } from '@react-spring/web';

export function useRegister(objectId: string) {
  const canvas = useCanvas();

  return useCallback(
    (element: Element | null) => {
      return canvas.registerElement(objectId, element);
    },
    [canvas, objectId],
  );
}

export function useCenter(objectId: string) {
  const origin = useOrigin(objectId);
  const size = useSize(objectId);

  if (!size || !origin) return { x: 0, y: 0 };

  return {
    x: to([size.width, origin.x], (width, x) => x - width / 2),
    y: to([size.height, origin.y], (height, y) => y - height / 2),
  };
}

export function useOrigin(objectId: string) {
  const canvas = useCanvas();
  const [origin, setOrigin] = useState(() => canvas.bounds.getOrigin(objectId));
  useEffect(() => {
    setOrigin(canvas.bounds.getOrigin(objectId));
    return canvas.bounds.subscribe(`originChange:${objectId}`, (origin) => {
      setOrigin(origin);
    });
  }, [canvas.bounds, objectId]);

  if (!origin) return { x: 0, y: 0 };

  return origin;
}

export function useSize(objectId: string) {
  const canvas = useCanvas();
  const [size, setSize] = useState(() => canvas.bounds.getSize(objectId));
  useEffect(() => {
    setSize(canvas.bounds.getSize(objectId));
    return canvas.bounds.subscribe(`sizeChange:${objectId}`, (size) => {
      setSize(size);
    });
  }, [canvas.bounds, objectId]);

  if (!size) return { width: 0, height: 0 };

  return size;
}

export function useBoundsObjectIds() {
  const canvas = useCanvas();
  const [ids, setIds] = useState<string[]>(() => canvas.bounds.ids);
  useEffect(() => {
    return canvas.bounds.subscribe('observedChange', () => {
      setIds(canvas.bounds.ids);
    });
  }, [canvas.bounds]);

  return ids;
}
