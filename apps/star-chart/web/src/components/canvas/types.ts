import { FrameValue } from '@react-spring/web';

export type Vector2 = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type RectLimits = {
  min: Vector2;
  max: Vector2;
};

export type LiveVector2 = {
  x: FrameValue<number>;
  y: FrameValue<number>;
};

export type LiveSize = {
  width: FrameValue<number>;
  height: FrameValue<number>;
};
