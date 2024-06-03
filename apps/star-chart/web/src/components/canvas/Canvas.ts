import { EventSubscriber } from '@a-type/utils';
import { proxy, subscribe } from 'valtio';
import { addVectors, snap, vectorDistance } from './math.js';
import { Vector2 } from './types.js';
import { Viewport } from './Viewport.js';
import { ObjectBounds } from './ObjectBounds.js';
import { ObjectPositions } from './ObjectPositions.js';
import { SpringValue, to } from '@react-spring/web';
import { Selections } from './Selections.js';

type ActiveGestureState = {
  objectId: string | null;
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
  private activeGesture = proxy<ActiveGestureState>({
    objectId: null,
    position: null,
    startPosition: null,
  });

  readonly bounds = new ObjectBounds();
  readonly positions = new ObjectPositions();
  readonly selections = new Selections();

  readonly objectElements = new Map<string, Element>();
  readonly objectMetadata = new Map<string, any>();

  private positionObservers: Record<string, Set<(position: Vector2) => void>> =
    {};

  private unsubscribeActiveGesture: () => void;

  private _positionSnapIncrement = 1;

  private _gestureActive = false;

  constructor(
    private viewport: Viewport,
    options?: CanvasOptions,
  ) {
    super();
    this.unsubscribeActiveGesture = subscribe(
      this.activeGesture,
      this.handleActiveGestureChange,
    );
    // @ts-ignore for debugging...
    window.canvas = this;
    this._positionSnapIncrement = options?.positionSnapIncrement ?? 1;
  }

  get snapIncrement() {
    return this._positionSnapIncrement;
  }

  private onGestureStart() {
    this._gestureActive = true;
    this.emitGestureChange();
    this.viewport.element.style.setProperty('cursor', 'grabbing');
  }

  private onGestureEnd() {
    this._gestureActive = true;
    this.emitGestureChange();
    this.viewport.element.style.removeProperty('cursor');
  }

  private onGestureMove() {
    this.emitGestureChange();
  }

  private emitGestureChange = () => {
    if (!this.activeGesture.objectId || !this.activeGesture.position) return;
    this.positions.update(
      this.activeGesture.objectId,
      this.activeGesture.position,
      { source: 'gesture' },
    );
    this.emit(
      `objectDrag:${this.activeGesture.objectId}`,
      this.activeGesture.position,
    );
  };

  get isGestureActive() {
    return this._gestureActive;
  }

  get gestureDistance() {
    const { position, startPosition } = this.activeGesture;
    if (!position || !startPosition) {
      return 0;
    }
    return vectorDistance(position, startPosition);
  }

  private commitGesture = (
    objectId: string,
    position: Vector2,
    info: { source: 'gesture' | 'external' },
  ) => {
    this.positions.update(objectId, position, info);
    return this.emit(`objectDrop:${objectId}`, position, info);
  };

  /**
   * Commits the gesture data from the active gesture store to
   * the backend
   */
  private commitActiveGesture = () => {
    const { objectId, position } = this.activeGesture;
    if (!objectId || !position) return;
    this.commitGesture(objectId, position, { source: 'gesture' });
  };

  // private throttledCommitActiveGesture = throttle(this.commitActiveGesture, MOVE_THROTTLE_PERIOD, { trailing: false });

  // subscribe to changes in active object position and forward them to the
  // correct object
  private handleActiveGestureChange = () => {
    if (this.activeGesture.objectId) {
      if (this.activeGesture.position) {
        const position = this.activeGesture.position;
        this.positionObservers[this.activeGesture.objectId]?.forEach((cb) =>
          cb(position),
        );
      }
    }
  };

  private clearActiveGesture = () => {
    this.activeGesture.objectId = null;
    this.activeGesture.position = null;
    this.activeGesture.startPosition = null;
  };

  private snapPosition = (position: Vector2) => ({
    x: snap(position.x, this._positionSnapIncrement),
    y: snap(position.y, this._positionSnapIncrement),
  });

  onObjectDragStart = (screenPosition: Vector2, objectId: string) => {
    const worldPosition = this.viewport.viewportToWorld(screenPosition, true);
    this.activeGesture.objectId = objectId;
    this.activeGesture.position = worldPosition;
    this.activeGesture.startPosition = worldPosition;
    this.onGestureStart();
  };

  onObjectDrag = (screenPosition: Vector2, objectId: string) => {
    const worldPosition = this.viewport.viewportToWorld(screenPosition, true);
    this.activeGesture.objectId = objectId;
    this.activeGesture.position = worldPosition;
    this.onGestureMove();
  };

  onObjectDragEnd = async (screenPosition: Vector2, objectId: string) => {
    const worldPosition = this.viewport.viewportToWorld(screenPosition, true);
    // capture the final position before committing
    this.activeGesture.objectId = objectId;
    this.activeGesture.position = worldPosition;
    this.onGestureEnd();
    this.commitActiveGesture();
    this.clearActiveGesture();
  };

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
   * Directly sets the world position of an object, applying
   * clamping and snapping behaviors.
   */
  setPosition = (objectId: string, worldPosition: Vector2) => {
    this.commitGesture(
      objectId,
      this.viewport.clampToWorld(this.snapPosition(worldPosition)),
      { source: 'external' },
    );
  };

  /**
   * Gets the instantaneous position of an object.
   */
  getPosition = (objectId: string): Vector2 | null => {
    const pos = this.positions.maybeGet(objectId);
    if (!pos) return null;
    return { x: pos.x.get(), y: pos.y.get() };
  };

  getCenter = (objectId: string): Vector2 | null => {
    const pos = this.positions.maybeGet(objectId);
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

  /**
   * Moves an object relatively from its current position in world coordinates, applying
   * clamping and snapping behaviors.
   */
  movePositionRelative = (
    currentPosition: Vector2,
    movement: Vector2,
    objectId: string,
  ) => {
    this.commitGesture(
      objectId,
      this.viewport.clampToWorld(
        this.snapPosition(addVectors(currentPosition, movement)),
      ),
      { source: 'external' },
    );
  };

  /**
   * Returns which object ID the world point intersects with
   */
  hitTest = (worldPosition: Vector2): string | null => {
    // TODO: faster
    for (const [id, position] of this.positions.all()) {
      const bounds = this.bounds.getSize(id);
      if (!bounds) continue;
      const x = position.x.get();
      const y = position.y.get();
      if (
        worldPosition.x >= x &&
        worldPosition.x <= x + bounds.width.get() &&
        worldPosition.y >= y &&
        worldPosition.y <= y + bounds.height.get()
      ) {
        return id;
      }
    }

    // TODO:
    // const intersections = this.bounds.getIntersections({
    //   x: worldPosition.x,
    //   y: worldPosition.y,
    //   width: 0,
    //   height: 0
    // }, 1)

    return null;
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
      console.info('unregistered', objectId);
      this.objectMetadata.delete(objectId);
      const el = this.objectElements.get(objectId);
      if (el) {
        this.bounds.unobserve(el);
        this.objectElements.delete(objectId);
      }
    }
  };

  dispose = () => {
    this.unsubscribeActiveGesture();
  };
}
