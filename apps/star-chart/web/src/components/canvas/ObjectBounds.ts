import { EventSubscriber } from '@a-type/utils';
import { SpringValue } from '@react-spring/web';
import { Box, LiveVector2 } from './types.js';

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
      this.origins.delete(objectId);
      this.emit('observedChange');
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
    return this.sizes.get(objectId);
  };

  getOrigin = (objectId: string) => {
    return this.origins.get(objectId);
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

  getIntersections = (box: Box, threshold: number) => {
    return this.ids.filter((objectId) =>
      this.intersects(objectId, box, threshold),
    );
  };

  intersects = (objectId: string, box: Box, threshold: number) => {
    const objectOrigin = this.getOrigin(objectId);
    const objectSize = this.getSize(objectId);

    if (!objectOrigin || !objectSize) return false;

    const objectX = objectOrigin.x.get();
    const objectY = objectOrigin.y.get();
    const objectWidth = objectSize.width.get();
    const objectHeight = objectSize.height.get();

    if (objectWidth === 0 && objectHeight === 0) {
      // this becomes a point containment check and always passes if true
      return (
        objectX >= box.x &&
        objectX <= box.x + box.width &&
        objectY >= box.y &&
        objectY <= box.y + box.height
      );
    }

    const objectBottomRight = {
      x: objectX + objectWidth,
      y: objectY + objectHeight,
    };

    const boxTopLeft = {
      x: box.x,
      y: box.y,
    };
    const boxBottomRight = {
      x: boxTopLeft.x + box.width,
      y: boxTopLeft.y + box.height,
    };

    if (objectWidth === 0) {
      // box must enclose the object horizontally
      if (objectX > boxBottomRight.x || objectX < boxTopLeft.x) return false;

      // this becomes a line containment check
      const intersectionArea = Math.max(
        0,
        Math.min(objectBottomRight.y, boxBottomRight.y) -
          Math.max(objectY, boxTopLeft.y),
      );
      return intersectionArea / objectHeight > threshold;
    } else if (objectHeight === 0) {
      // box must enclose the object vertically
      if (objectY > boxBottomRight.y || objectY < boxTopLeft.y) return false;

      // this becomes a line containment check
      const intersectionArea = Math.max(
        0,
        Math.min(objectBottomRight.x, boxBottomRight.x) -
          Math.max(objectX, boxTopLeft.x),
      );
      return intersectionArea / objectWidth > threshold;
    }

    // ensure this isn't 0 as it's used as a divisor (although we should be safe here)
    const testArea = Math.max(Number.MIN_VALUE, objectWidth * objectHeight);
    const intersectionArea =
      Math.max(
        0,
        Math.min(objectBottomRight.x, boxBottomRight.x) -
          Math.max(objectX, boxTopLeft.x),
      ) *
      Math.max(
        0,
        Math.min(objectBottomRight.y, boxBottomRight.y) -
          Math.max(objectY, boxTopLeft.y),
      );

    return intersectionArea / testArea > threshold;
  };
}
