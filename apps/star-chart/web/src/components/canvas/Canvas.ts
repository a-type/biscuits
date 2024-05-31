import { EventSubscriber } from '@a-type/utils';
import {
  addVectors,
  clamp,
  multiplyVector,
  snap,
  snapWithoutZero,
  vectorDistance,
} from './math.js';
import { Bounds, Vector2 } from './types.js';
import { Viewport } from './Viewport.js';
import { proxy, subscribe } from 'valtio';

const MOVE_THROTTLE_PERIOD = 100;

type ActiveGestureState = {
  objectId: string | null;
  position: Vector2 | null;
  startPosition: Vector2 | null;
};

export interface CanvasOptions {
  /** Snaps items to a world-unit grid after dropping them - defaults to 1. */
  positionSnapIncrement?: number;
}

export type CanvasEvents = {
  gestureStart: () => void;
  gestureEnd: () => void;
  gestureMove: () => void;
  [k: `positionChange:${string}`]: (newPosition: Vector2) => void;
  [k: `gestureChange:${string}`]: (newPosition: Vector2) => void;
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

  private onGestureStart() {
    this._gestureActive = true;
    this.emit('gestureStart');
    this.emitGestureChange();
    this.viewport.element.style.setProperty('cursor', 'grabbing');
  }

  private onGestureEnd() {
    this._gestureActive = true;
    this.emit('gestureEnd');
    this.emitGestureChange();
    this.viewport.element.style.removeProperty('cursor');
  }

  private onGestureMove() {
    this.emit('gestureMove');
    this.emitGestureChange();
  }

  private emitGestureChange = () => {
    if (!this.activeGesture.objectId || !this.activeGesture.position) return;
    this.emit(
      `gestureChange:${this.activeGesture.objectId}`,
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

  private commitGesture = (objectId: string, position: Vector2) => {
    return this.emit(`positionChange:${objectId}`, position);
  };

  /**
   * Commits the gesture data from the active gesture store to
   * the backend
   */
  private commitActiveGesture = () => {
    const { objectId, position } = this.activeGesture;
    if (!objectId || !position) return;
    this.commitGesture(objectId, position);
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
    // TODO: do we want real-time movement?
    // this.throttledCommitActiveGesture();
    this.onGestureMove();
  };

  onObjectDragEnd = async (screenPosition: Vector2, objectId: string) => {
    const worldPosition = this.viewport.viewportToWorld(screenPosition, true);
    // capture the final position before committing
    this.activeGesture.objectId = objectId;
    this.activeGesture.position = worldPosition;
    // wait for confirmation from server of gesture change before finishing the gesture
    await this.commitActiveGesture();
    this.clearActiveGesture();
    this.onGestureEnd();
  };

  /**
   * Directly sets the world position of an object, applying
   * clamping and snapping behaviors.
   */
  setPosition = (worldPosition: Vector2, objectId: string) => {
    this.commitGesture(
      objectId,
      this.viewport.clampToWorld(this.snapPosition(worldPosition)),
    );
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
    );
  };

  dispose = () => {
    this.unsubscribeActiveGesture();
  };
}
