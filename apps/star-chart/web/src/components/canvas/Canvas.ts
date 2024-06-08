import { EventSubscriber } from '@a-type/utils';
import { SpringValue, to } from '@react-spring/web';
import { clampVector, snap } from './math.js';
import { ObjectBounds } from './ObjectBounds.js';
import { Selections } from './Selections.js';
import { RectLimits, Vector2 } from './types.js';
import { Viewport, ViewportConfig, ViewportEventOrigin } from './Viewport.js';
import { proxy } from 'valtio';

export interface CanvasOptions {
  /** Snaps items to a world-unit grid after dropping them - defaults to 1. */
  positionSnapIncrement?: number;
  limits?: RectLimits;
  viewportConfig?: Omit<ViewportConfig, 'canvas'>;
}

export interface CanvasGestureInfo {
  shift: boolean;
  alt: boolean;
  ctrlOrMeta: boolean;
  intentional: boolean;
  delta: Vector2;
  worldPosition: Vector2;
  targetId?: string;
}

export interface CanvasGestureInput
  extends Omit<CanvasGestureInfo, 'worldPosition'> {
  screenPosition: Vector2;
}

const DEFAULT_LIMITS: RectLimits = {
  max: { x: 1_000_000, y: 1_000_000 },
  min: { x: -1_000_000, y: -1_000_000 },
};

export type CanvasEvents = {
  objectDragStart: (info: CanvasGestureInfo) => void;
  objectDrag: (info: CanvasGestureInfo) => void;
  objectDragEnd: (info: CanvasGestureInfo) => void;
  canvasTap: (info: CanvasGestureInfo) => void;
  canvasDragStart: (info: CanvasGestureInfo) => void;
  canvasDrag: (info: CanvasGestureInfo) => void;
  canvasDragEnd: (info: CanvasGestureInfo) => void;
  resize: (size: RectLimits) => void;
};

export class Canvas extends EventSubscriber<CanvasEvents> {
  readonly viewport: Viewport;
  readonly limits: RectLimits;

  readonly bounds = new ObjectBounds();
  readonly selections = new Selections();

  readonly objectElements = new Map<string, Element>();
  readonly objectMetadata = new Map<string, any>();

  readonly tools = proxy({
    dragLocked: false,
    boxSelect: false,
  });

  readonly gestureState = {
    claimedBy: null as string | null,
  };

  private _positionSnapIncrement = 1;

  constructor(options?: CanvasOptions) {
    super();
    this.viewport = new Viewport({ ...options?.viewportConfig, canvas: this });
    this.limits = options?.limits ?? DEFAULT_LIMITS;
    // @ts-ignore for debugging...
    window.canvas = this;
    this._positionSnapIncrement = options?.positionSnapIncrement ?? 1;
  }

  get snapIncrement() {
    return this._positionSnapIncrement;
  }

  get boundary() {
    return {
      x: this.limits.min.x,
      y: this.limits.min.y,
      width: this.limits.max.x - this.limits.min.x,
      height: this.limits.max.y - this.limits.min.y,
    };
  }

  get center() {
    return {
      x: (this.limits.max.x + this.limits.min.x) / 2,
      y: (this.limits.max.y + this.limits.min.y) / 2,
    };
  }

  snapPosition = (position: Vector2) => ({
    x: snap(position.x, this._positionSnapIncrement),
    y: snap(position.y, this._positionSnapIncrement),
  });

  clampPosition = (position: Vector2) =>
    clampVector(position, this.limits.min, this.limits.max);

  resize = (size: RectLimits) => {
    this.limits.min = size.min;
    this.limits.max = size.max;
    this.emit('resize', size);
  };

  private transformGesture = (
    { screenPosition, delta, ...rest }: CanvasGestureInput,
    snap?: boolean,
  ): CanvasGestureInfo => {
    let pos = this.viewport.viewportToWorld(screenPosition);
    if (snap) {
      pos = this.snapPosition(pos);
    }
    return Object.assign(rest, {
      worldPosition: pos,
      delta: this.viewport.viewportDeltaToWorld(delta),
    });
  };

  onCanvasTap = (info: CanvasGestureInput) => {
    this.emit('canvasTap', this.transformGesture(info));
  };

  onCanvasDragStart = (info: CanvasGestureInput) => {
    this.emit('canvasDragStart', this.transformGesture(info));
  };

  onCanvasDrag = (info: CanvasGestureInput) => {
    this.emit('canvasDrag', this.transformGesture(info));
  };

  onCanvasDragEnd = (info: CanvasGestureInput) => {
    this.emit('canvasDragEnd', this.transformGesture(info));
  };

  onObjectDragStart = (info: CanvasGestureInput) => {
    this.emit('objectDragStart', this.transformGesture(info));
  };

  onObjectDrag = (info: CanvasGestureInput) => {
    this.emit('objectDrag', this.transformGesture(info));
  };

  onObjectDragEnd = (info: CanvasGestureInput) => {
    this.emit('objectDragEnd', this.transformGesture(info));
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

  zoomToFit = (
    options: { origin?: ViewportEventOrigin; margin?: number } = {},
  ) => {
    const bounds = this.bounds.getCurrentContainer();
    if (bounds) {
      this.viewport.fitOnScreen(bounds, options);
    } else {
      this.viewport.doMove(this.center, 1, options);
    }
  };

  dispose = () => {};
}
