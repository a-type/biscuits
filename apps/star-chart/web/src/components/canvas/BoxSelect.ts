import { EventSubscriber } from '@a-type/utils';
import { SpringValue } from '@react-spring/web';
import { Size, Vector2 } from './types.js';

export type BoxSelectEvents = {
  start: () => void;
  commit: (
    newPosition: { x: number; y: number },
    newSize: { width: number; height: number },
  ) => void;
  cancel: () => void;
};

export class BoxSelect extends EventSubscriber<BoxSelectEvents> {
  readonly origin = {
    x: new SpringValue(0),
    y: new SpringValue(0),
  };
  readonly size = {
    width: new SpringValue(0),
    height: new SpringValue(0),
  };

  private _active = false;

  start = ({ x, y }: Vector2) => {
    this.origin.x.set(x);
    this.origin.y.set(y);
    this.size.width.set(0);
    this.size.height.set(0);
    this._active = true;
    this.emit('start');
  };

  update = ({ x, y }: Vector2) => {
    if (!this._active) return;
    const width = x - this.origin.x.get();
    const height = y - this.origin.y.get();
    this.size.width.set(width);
    this.size.height.set(height);
  };

  commit = () => {
    if (!this._active) return;
    this._active = false;
    this.emit(
      'commit',
      { x: this.origin.x.get(), y: this.origin.y.get() },
      { width: this.size.width.get(), height: this.size.height.get() },
    );
    this.size.width.set(0);
    this.size.height.set(0);
  };

  cancel = () => {
    if (!this._active) return;
    this._active = false;
    this.emit('cancel');
    this.size.width.set(0);
    this.size.height.set(0);
  };

  /**
   * Determines if an object intersects the box over a certain
   * percentage threshold
   */
  intersects = (topLeft: Vector2, size: Size, threshold = 0) => {
    const bottomRight = {
      x: topLeft.x + size.width,
      y: topLeft.y + size.height,
    };

    const boxTopLeft = {
      x: this.origin.x.get(),
      y: this.origin.y.get(),
    };
    const boxBottomRight = {
      x: boxTopLeft.x + this.size.width.get(),
      y: boxTopLeft.y + this.size.height.get(),
    };

    const testArea = size.width * size.height;
    const intersectionArea =
      Math.max(
        0,
        Math.min(bottomRight.x, boxBottomRight.x) -
          Math.max(topLeft.x, boxTopLeft.x),
      ) *
      Math.max(
        0,
        Math.min(bottomRight.y, boxBottomRight.y) -
          Math.max(topLeft.y, boxTopLeft.y),
      );

    return intersectionArea / testArea > threshold;
  };
}
