import { EventSubscriber } from '@a-type/utils';
import { Vector2 } from './types.js';
import { SpringValue } from '@react-spring/web';

export interface Bounds {
  width: number;
  height: number;
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

  private updateBounds = (objectId: string, changes: Partial<Bounds>) => {
    let bounds = this.bounds.get(objectId);
    if (!bounds) {
      bounds = { width: 0, height: 0 };
      this.bounds.set(objectId, bounds);
    }
    Object.assign(bounds, changes);
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
    return this.bounds.get(objectId);
  };

  private handleChanges = (entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
      const objectId = entry.target.getAttribute('data-observed-object-id');
      if (!objectId) return;
      const bounds = entry.contentRect;
      const existing = this.bounds.get(objectId);
      if (existing) {
        // x/y are not helpful here
        this.updateBounds(objectId, {
          width: bounds.width,
          height: bounds.height,
        });
      }
    });
  };
}
