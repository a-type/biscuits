import { SpringValue, to } from '@react-spring/web';
import { LiveSize, LiveVector2, Vector2 } from './types.js';

/**
 * Constrains a number to be between a min and max value
 * @param value
 * @param min
 * @param max
 */
export function clamp(
  value: number,
  min: number = -Infinity,
  max: number = Infinity,
) {
  // if min and max overlap, return the average (center)
  if (min > max) {
    return (min + max) / 2;
  }
  return Math.max(min, Math.min(max, value));
}

export function addVectors(v1: Vector2, v2: Vector2) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  };
}

export function subtractVectors(v1: Vector2, v2: Vector2) {
  return addVectors(v1, {
    x: -v2.x,
    y: -v2.y,
  });
}

export function multiplyVector(vec: Vector2, mult: number) {
  return {
    x: vec.x * mult,
    y: vec.y * mult,
  };
}

export function normalizeVector(vec: Vector2) {
  const len = vectorLength(vec);
  if (len === 0) {
    return { x: 0, y: 0 };
  }
  return multiplyVector(vec, 1 / len);
}

export function roundVector(vector: Vector2) {
  return {
    x: Math.round(vector.x),
    y: Math.round(vector.y),
  };
}

/** restricts a vector to the bounds of the rectangle defined by min and max */
export function clampVector(v: Vector2, min: Vector2, max: Vector2) {
  return {
    x: clamp(v.x, min.x, max.x),
    y: clamp(v.y, min.y, max.y),
  };
}

export function vectorDistance(v1: Vector2, v2: Vector2) {
  return Math.sqrt(
    Math.pow(Math.abs(v1.x - v2.x), 2) + Math.pow(Math.abs(v1.y - v2.y), 2),
  );
}

export function vectorLength(v: Vector2) {
  return vectorDistance(v, { x: 0, y: 0 });
}

/**
 * "Fuzzes" a vector by moving it a bit in a random direction
 * @param vec the original position
 * @param maxDistance maximum distance to fuzz
 */
export function fuzzVector(vec: Vector2, maxDistance: number = 10) {
  const randomAngle = Math.random() * Math.PI * 2;
  const directionNormal = {
    x: Math.cos(randomAngle),
    y: Math.sin(randomAngle),
  };
  return addVectors(
    vec,
    multiplyVector(directionNormal, Math.random() * maxDistance),
  );
}

/**
 * Rounds a value to the closest multiple of an increment
 */
export function snap(value: number, increment: number) {
  return Math.round(value / increment) * increment;
}

export function snapVector(vec: Vector2, increment: number) {
  return {
    x: snap(vec.x, increment),
    y: snap(vec.y, increment),
  };
}

/**
 * Rounds a value to the closest multiple of an increment,
 * defaulting to 1 x increment if the value is smaller than 1
 * increment instead of 0.
 */
export function snapWithoutZero(value: number, increment: number) {
  return Math.max(increment, snap(value, increment));
}

/**
 * Measures if a number is between a min and max, inclusive on both
 * ends. If either min or max is undefined, it passes that check.
 */
export function isInBounds(value: number, min?: number, max?: number) {
  return (!max || value <= max) && (!min || value >= min);
}

/**
 * Compares two numbers for equality, with a given tolerance
 */
export function compareEpsilon(
  value: number,
  target: number,
  epsilon = Number.EPSILON,
) {
  return Math.abs(value - target) <= epsilon;
}

/**
 * Compares two numbers for equality with a percentage-based tolerance. Default 1%.
 */
export function compareWithTolerance(
  value: number,
  target: number,
  tolerance = 0.01,
) {
  const ratio = value / target;
  const delta = Math.abs(ratio - 1);
  return delta < tolerance;
}

export function roundTenths(percentage: number) {
  return Math.round(percentage * 10) / 10;
}

export function addToSpringVector(
  vec: LiveVector2,
  add: Vector2 | LiveVector2,
) {
  if (isVector2(add)) {
    return {
      x: to([vec.x], (v) => v + add.x),
      y: to([vec.y], (v) => v + add.y),
    };
  }

  return {
    x: to([vec.x, add.x], (v1, v2) => v1 + v2),
    y: to([vec.y, add.y], (v1, v2) => v1 + v2),
  };
}

function isVector2(obj: any): obj is Vector2 {
  return obj.x !== undefined && obj.y !== undefined;
}

export function closestLivePoint(
  sourceCenter: LiveVector2,
  sourceBounds: LiveSize,
  targetCenter: LiveVector2,
  shortenBy: number = 0,
) {
  const point = to(
    [
      sourceCenter.x,
      sourceCenter.y,
      sourceBounds.width,
      sourceBounds.height,
      targetCenter.x,
      targetCenter.y,
    ],
    (sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY) => {
      const dx = targetX - sourceX;
      const dy = targetY - sourceY;
      const length = Math.sqrt(dx * dx + dy * dy);
      if (length === 0) {
        return { x: sourceX, y: sourceY };
      }
      const normalizedX = dx / length;
      const normalizedY = dy / length;
      const longestBound = Math.max(sourceWidth / 2, sourceHeight / 2);
      const projectedX = normalizedX * longestBound;
      const projectedY = normalizedY * longestBound;
      const cappedX =
        Math.min(Math.abs(projectedX), sourceWidth / 2) * Math.sign(projectedX);
      const cappedY =
        Math.min(Math.abs(projectedY), sourceHeight / 2) *
        Math.sign(projectedY);
      const shortenedX = cappedX - normalizedX * shortenBy;
      const shortenedY = cappedY - normalizedY * shortenBy;
      return {
        x: sourceX + shortenedX,
        y: sourceY + shortenedY,
      };
    },
  );

  return {
    x: point.to((p) => p.x),
    y: point.to((p) => p.y),
  };
}

export interface Bezier {
  start: Vector2;
  end: Vector2;
  control1: Vector2;
  control2: Vector2;
}

export function getWireBezierForEndPoints(
  // params are like this for convenience with most usage.
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): Bezier {
  if (Math.abs(startX - endX) > Math.abs(startY - endY)) {
    return {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      control1: { x: startX + (endX - startX) / 2, y: startY },
      control2: { x: startX + (endX - startX) / 2, y: endY },
    };
  }

  return {
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
    control1: { x: startX, y: startY + (endY - startY) / 2 },
    control2: { x: endX, y: startY + (endY - startY) / 2 },
  };
}

export function computeSamplesOnBezier(
  curve: Bezier,
  {
    samples = 100,
    startT = 0,
    endT = 1,
  }: {
    samples?: number;
    startT?: number;
    endT?: number;
  },
) {
  const points = [];
  const range = endT - startT;
  for (let i = 0; i <= samples; i++) {
    const t = startT + (i / samples) * range;
    points.push({
      x:
        (1 - t) ** 3 * curve.start.x +
        3 * (1 - t) ** 2 * t * curve.control1.x +
        3 * (1 - t) * t ** 2 * curve.control2.x +
        t ** 3 * curve.end.x,
      y:
        (1 - t) ** 3 * curve.start.y +
        3 * (1 - t) ** 2 * t * curve.control1.y +
        3 * (1 - t) * t ** 2 * curve.control2.y +
        t ** 3 * curve.end.y,

      t,
    });
  }
  return points;
}

export function distanceToBezier(curve: Bezier, point: Vector2) {
  // start with the whole curve
  const samples = computeSamplesOnBezier(curve, { samples: 100 });
  let minDistance = Infinity;
  let closestPoint = { x: 0, y: 0, t: 0 };
  for (const sample of samples) {
    const distance = vectorDistance(sample, point);
    minDistance = Math.min(minDistance, distance);
    if (distance === minDistance) {
      closestPoint = sample;
    }
  }

  // having found the closest point at default resolution,
  // we can now refine the search around that point
  const refinedSamples = computeSamplesOnBezier(curve, {
    samples: 20,
    startT: closestPoint.t - 0.1,
    endT: closestPoint.t + 0.1,
  });
  for (const sample of refinedSamples) {
    const distance = vectorDistance(sample, point);
    minDistance = Math.min(minDistance, distance);
    if (distance === minDistance) {
      closestPoint = sample;
    }
  }

  return {
    distance: minDistance,
    closestPoint,
  };
}
