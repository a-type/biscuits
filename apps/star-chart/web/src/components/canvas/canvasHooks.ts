import { useCallback, useEffect, useRef, useState } from 'react';
import { useCanvas } from './CanvasProvider.jsx';
import { to } from '@react-spring/web';
import { Vector2 } from './types.js';
import { Canvas, CanvasGestureInfo } from './Canvas.js';

export function useRegister(objectId: string, metadata?: any) {
  const canvas = useCanvas();
  const metadataRef = useRef(metadata);
  metadataRef.current = metadata;

  return useCallback(
    (element: Element | null) => {
      return canvas.registerElement(objectId, element, metadataRef.current);
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

export function useCanvasGestures(handlers: {
  onDragStart?: (
    position: Vector2,
    ctx: { canvas: Canvas; info: CanvasGestureInfo },
  ) => void;
  onDrag?: (
    position: Vector2,
    ctx: { canvas: Canvas; info: CanvasGestureInfo },
  ) => void;
  onDragEnd?: (
    position: Vector2,
    ctx: { canvas: Canvas; info: CanvasGestureInfo },
  ) => void;
  onTap?: (
    position: Vector2,
    ctx: { canvas: Canvas; info: CanvasGestureInfo },
  ) => void;
}) {
  const canvas = useCanvas();
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const unsubs = [
      canvas.subscribe('canvasDragStart', (position, info) => {
        handlersRef.current.onDragStart?.(position, {
          canvas,
          info,
        });
      }),
      canvas.subscribe('canvasDrag', (position, info) => {
        handlersRef.current.onDrag?.(position, {
          canvas,
          info,
        });
      }),
      canvas.subscribe('canvasDragEnd', (position, info) => {
        handlersRef.current.onDragEnd?.(position, {
          canvas,
          info,
        });
      }),
      canvas.subscribe('canvasTap', (position, info) => {
        handlersRef.current.onTap?.(position, {
          canvas,
          info,
        });
      }),
    ];

    return () => {
      unsubs.forEach((fn) => fn());
    };
  }, [canvas]);
}

export function useIsSelected(objectId: string) {
  const canvas = useCanvas();
  const [selected, setSelected] = useState(() =>
    canvas.selections.selectedIds.has(objectId),
  );
  const [exclusive, setExclusive] = useState(
    () =>
      canvas.selections.selectedIds.has(objectId) &&
      canvas.selections.selectedIds.size === 1,
  );

  useEffect(() => {
    return canvas.selections.subscribe(`change:${objectId}`, setSelected);
  }, [canvas.selections, objectId]);
  useEffect(() => {
    return canvas.selections.subscribe('change', (selectedIds) => {
      setExclusive(selectedIds.length === 1 && selectedIds[0] === objectId);
    });
  }, [canvas.selections, objectId]);

  return { selected, exclusive };
}

export function useIsPendingSelection(objectId: string) {
  const canvas = useCanvas();
  const [pending, setPending] = useState(() =>
    canvas.selections.pendingIds.has(objectId),
  );
  useEffect(() => {
    return canvas.selections.subscribe(`pendingChange:${objectId}`, setPending);
  }, [canvas.selections, objectId]);

  return pending;
}

export function useSelectedObjectIds() {
  const canvas = useCanvas();
  const [selectedIds, setSelectedIds] = useState(() =>
    Array.from(canvas.selections.selectedIds),
  );

  useEffect(() => {
    return canvas.selections.subscribe('change', setSelectedIds);
  }, [canvas.selections]);

  return selectedIds;
}
