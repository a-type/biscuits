import { EventSubscriber } from '@a-type/utils';
import { SpringValue, to } from '@react-spring/web';
import { snap } from './math.js';
import { ObjectBounds } from './ObjectBounds.js';
import { ObjectPositions } from './ObjectPositions.js';
import { Selections } from './Selections.js';
import { Vector2 } from './types.js';
import { Viewport } from './Viewport.js';

type ActiveGestureState = {
  targetObjectId: string | null;
  position: Vector2 | null;
  startPosition: Vector2 | null;
};

export interface CanvasOptions {
  /** Snaps items to a world-unit grid after dropping them - defaults to 1. */
  positionSnapIncrement?: number;
}

export interface CanvasGestureInfo {
  shift: boolean;
  alt: boolean;
  ctrlOrMeta: boolean;
}

export type CanvasEvents = {
  [k: `objectDrop:${string}`]: (
    newPosition: Vector2,
    info: { source: 'gesture' | 'external' },
  ) => void;
  [k: `objectDrag:${string}`]: (newPosition: Vector2) => void;
  canvasTap: (position: Vector2, info: CanvasGestureInfo) => void;
  canvasDragStart: (position: Vector2, info: CanvasGestureInfo) => void;
  canvasDrag: (position: Vector2, info: CanvasGestureInfo) => void;
  canvasDragEnd: (position: Vector2, info: CanvasGestureInfo) => void;
};

/**
 * This class encapsulates the logic which powers the movement and
 * sizing of objects within a Room Canvas - the 2d space that makes
 * up the standard With Room. It implements the required functionality
 * for both CanvasContext and SizingContext
 */
export class Canvas extends EventSubscriber<CanvasEvents> {
  readonly bounds = new ObjectBounds();
  readonly selections = new Selections();

  readonly objectElements = new Map<string, Element>();
  readonly objectMetadata = new Map<string, any>();

  private _positionSnapIncrement = 1;

  constructor(
    private viewport: Viewport,
    options?: CanvasOptions,
  ) {
    super();
    // @ts-ignore for debugging...
    window.canvas = this;
    this._positionSnapIncrement = options?.positionSnapIncrement ?? 1;
  }

  get snapIncrement() {
    return this._positionSnapIncrement;
  }

  snapPosition = (position: Vector2) => ({
    x: snap(position.x, this._positionSnapIncrement),
    y: snap(position.y, this._positionSnapIncrement),
  });

  onCanvasTap = (screenPosition: Vector2, info: CanvasGestureInfo) => {
    const worldPosition = this.viewport.viewportToWorld(screenPosition);
    this.emit('canvasTap', worldPosition, info);
  };

  onCanvasDragStart = (screenPosition: Vector2, info: CanvasGestureInfo) => {
    const worldPosition = this.viewport.viewportToWorld(screenPosition);
    this.emit('canvasDragStart', worldPosition, info);
  };

  onCanvasDrag = (screenPosition: Vector2, info: CanvasGestureInfo) => {
    const worldPosition = this.viewport.viewportToWorld(screenPosition);
    this.emit('canvasDrag', worldPosition, info);
  };

  onCanvasDragEnd = (screenPosition: Vector2, info: CanvasGestureInfo) => {
    const worldPosition = this.viewport.viewportToWorld(screenPosition);
    this.emit('canvasDragEnd', worldPosition, info);
  };

  /**
   * Gets the instantaneous position of an object.
   */
  getPosition = (objectId: string): Vector2 | null => {
    const pos = this.getLivePosition(objectId);
    if (!pos) return null;
    return { x: pos.x.get(), y: pos.y.get() };
  };

  getCenter = (objectId: string): Vector2 | null => {
    const pos = this.getLivePosition(objectId);
    if (!pos) return null;
    const bounds = this.bounds.getSize(objectId);
    if (!bounds) {
      return { x: pos.x.get(), y: pos.y.get() };
    }
    return {
      x: pos.x.get() + bounds.width.get() / 2,
      y: pos.y.get() + bounds.height.get() / 2,
    };
  };

  getLivePosition = (objectId: string) => this.bounds.getOrigin(objectId);
  getLiveSize = (objectId: string) => this.bounds.getSize(objectId);

  getLiveCenter = (objectId: string) => {
    const pos = this.getLivePosition(objectId);
    const bounds = this.bounds.getSize(objectId);
    if (!pos) {
      return {
        x: new SpringValue(0),
        y: new SpringValue(0),
      };
    }
    if (!bounds) {
      return pos;
    }
    return {
      x: to([pos.x, bounds.width], (x, width) => x + width / 2),
      y: to([pos.y, bounds.height], (y, height) => y + height / 2),
    };
  };

  /**
   * Gets the position of an object relative to the viewport
   */
  getViewportPosition = (objectId: string): Vector2 | null => {
    const worldPosition = this.getPosition(objectId);
    if (!worldPosition) return null;
    return this.viewport.worldToViewport(worldPosition);
  };

  registerElement = (
    objectId: string,
    element: Element | null,
    metadata?: any,
  ) => {
    if (element) {
      this.objectElements.set(objectId, element);
      this.bounds.observe(objectId, element);
      this.objectMetadata.set(objectId, metadata);
    } else {
      this.objectMetadata.delete(objectId);
      const el = this.objectElements.get(objectId);
      if (el) {
        this.bounds.unobserve(el);
        this.objectElements.delete(objectId);
      }
    }
  };

  dispose = () => {};
}
