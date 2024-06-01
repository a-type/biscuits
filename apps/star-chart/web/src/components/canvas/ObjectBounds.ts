import { EventSubscriber } from '@a-type/utils';
import { SpringValue } from '@react-spring/web';

export interface Bounds {
  width: SpringValue<number>;
  height: SpringValue<number>;
}

export class ObjectBounds extends EventSubscriber<{
  [k: `sizeChange:${string}`]: (bounds: Bounds) => void;
}> {
  private bounds: Map<string, Bounds> = new Map();
  private sizeObserver;

  constructor() {
    super();
    this.sizeObserver = new ResizeObserver(this.handleChanges);
  }

  private updateBounds = (
    objectId: string,
    changes: Partial<{ width: number; height: number }>,
  ) => {
    let bounds = this.bounds.get(objectId);
    if (!bounds) {
      bounds = { width: new SpringValue(0), height: new SpringValue(0) };
      this.bounds.set(objectId, bounds);
    }

    if (changes.width) {
      bounds.width.set(changes.width);
    }
    if (changes.height) {
      bounds.height.set(changes.height);
    }

    this.emit(`sizeChange:${objectId}`, bounds);
  };

  observe = (objectId: string, element: HTMLElement | null) => {
    // supports React <19 refs
    if (element === null) {
      this.bounds.delete(objectId);
      return;
    }

    element.setAttribute('data-observed-object-id', objectId);
    this.sizeObserver.observe(element);
    // seed initial state
    this.updateBounds(objectId, {
      width: element.clientWidth,
      height: element.clientHeight,
    });
    return () => void this.sizeObserver.unobserve(element);
  };

  get = (objectId: string) => {
    const existing = this.bounds.get(objectId);
    if (!existing) {
      this.updateBounds(objectId, { width: 0, height: 0 });
      return this.bounds.get(objectId)!;
    }
    return existing;
  };

  private handleChanges = (entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
      const objectId = entry.target.getAttribute('data-observed-object-id');
      if (!objectId) return;
      const bounds = entry.borderBoxSize[0];
      const existing = this.bounds.get(objectId);
      if (existing) {
        // x/y are not helpful here
        this.updateBounds(objectId, {
          width: bounds.inlineSize,
          height: bounds.blockSize,
        });
      }
    });
  };
}
