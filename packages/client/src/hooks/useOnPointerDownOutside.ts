import { useEffect, useRef } from 'react';

export function useOnPointerDownOutside<
  El extends HTMLElement = HTMLDivElement,
>(handler: (event: PointerEvent) => void) {
  const ref = useRef<El>(null);
  useEffect(() => {
    const listener = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        handler(event);
      }
    };

    document.addEventListener('pointerdown', listener);
    return () => {
      document.removeEventListener('pointerdown', listener);
    };
  }, [handler, ref]);

  return ref;
}
