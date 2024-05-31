import { SpringValue } from '@react-spring/web';
import { SPRINGS } from './constants.js';

export class ObjectPositions {
  private positions = new Map<
    string,
    {
      x: SpringValue<number>;
      y: SpringValue<number>;
    }
  >();

  constructor(private springConfig = SPRINGS.QUICK) {}

  get = (objectId: string) => {
    const existing = this.maybeGet(objectId);
    if (!existing) {
      const position = {
        x: new SpringValue(0, {
          config: this.springConfig,
        }),
        y: new SpringValue(0, {
          config: this.springConfig,
        }),
      };
      this.positions.set(objectId, position);
      return position;
    }
    return existing;
  };

  maybeGet = (objectId: string) => {
    return this.positions.get(objectId);
  };

  update = (
    objectId: string,
    changes: { x?: number; y?: number },
    { source }: { source: 'gesture' | 'external' },
  ) => {
    const position = this.get(objectId);
    if (changes.x !== undefined) {
      position.x.start(changes.x, {
        immediate: source === 'gesture',
      });
    }
    if (changes.y !== undefined) {
      position.y.start(changes.y, {
        immediate: source === 'gesture',
      });
    }
  };

  all = () => {
    return Array.from(this.positions.entries());
  };

  remove = (objectId: string) => {
    this.positions.delete(objectId);
  };
}
