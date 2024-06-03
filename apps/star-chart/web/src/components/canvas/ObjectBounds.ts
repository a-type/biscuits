import { EventSubscriber } from '@a-type/utils';
import { SpringValue } from '@react-spring/web';
import { LiveVector2 } from './types.js';

export interface Bounds {
  width: SpringValue<number>;
  height: SpringValue<number>;
}

export class ObjectBounds extends EventSubscriber<{
  [k: `sizeChange:${string}`]: (bounds: Bounds) => void;
  [k: `originChange:${string}`]: (origin: LiveVector2) => void;
  observedChange: () => void;
}> {
  private origins: Map<string, LiveVector2> = new Map();
  private sizes: Map<string, Bounds> = new Map();
  private sizeObserver;

  constructor() {
    super();
    this.sizeObserver = new ResizeObserver(this.handleChanges);
  }

  private updateSize = (
    objectId: string,
    changes: Partial<{ width: number; height: number }>,
  ) => {
    let bounds = this.sizes.get(objectId);
    if (!bounds) {
      bounds = { width: new SpringValue(0), height: new SpringValue(0) };
      this.sizes.set(objectId, bounds);
      this.emit('observedChange');
      this.emit(`sizeChange:${objectId}`, bounds);
    }

    if (changes.width) {
      bounds.width.set(changes.width);
    }
    if (changes.height) {
      bounds.height.set(changes.height);
    }
  };

  observe = (objectId: string, element: Element | null) => {
    // supports React <19 refs
    if (element === null) {
      this.sizes.delete(objectId);
      return;
    }

    element.setAttribute('data-observed-object-id', objectId);
    this.sizeObserver.observe(element);
    // seed initial state
    this.updateSize(objectId, {
      width: element.clientWidth,
      height: element.clientHeight,
    });
    return () => void this.sizeObserver.unobserve(element);
  };

  unobserve = (el: Element) => {
    const objectId = el.getAttribute('data-observed-object-id');
    if (objectId) {
      this.sizes.delete(objectId);
      this.sizeObserver.unobserve(el);
    }
  };

  registerOrigin = (objectId: string, origin: LiveVector2) => {
    this.origins.set(objectId, origin);
    this.emit(`originChange:${objectId}`, origin);
    return () => {
      this.origins.delete(objectId);
    };
  };

  getSize = (objectId: string) => {
    const existing = this.sizes.get(objectId);
    if (!existing) {
      this.updateSize(objectId, { width: 0, height: 0 });
      return this.sizes.get(objectId)!;
    }
    return existing;
  };

  getOrigin = (objectId: string) => {
    const existing = this.origins.get(objectId);
    if (existing) {
      return existing;
    }
    const origin = {
      x: new SpringValue(0),
      y: new SpringValue(0),
    };
    this.origins.set(objectId, origin);
    this.emit(`originChange:${objectId}`, origin);
    return origin;
  };

  private handleChanges = (entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
      const objectId = entry.target.getAttribute('data-observed-object-id');
      if (!objectId) return;
      const bounds = entry.borderBoxSize[0];
      const existing = this.sizes.get(objectId);
      if (existing) {
        // x/y are not helpful here
        this.updateSize(objectId, {
          width: bounds.inlineSize,
          height: bounds.blockSize,
        });
      }
    });
  };

  get ids() {
    return Array.from(this.sizes.keys());
  }
}
