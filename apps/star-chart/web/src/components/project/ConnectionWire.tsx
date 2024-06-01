import { hooks } from '@/store.js';
import { Connection } from '@star-chart.biscuits/verdant';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { Wire } from '../canvas/Wire.jsx';
import { useMemo } from 'react';
import { closestLivePoint } from '../canvas/math.js';

export interface ConnectionWireProps {
  connection: Connection;
}

export function ConnectionWire({ connection }: ConnectionWireProps) {
  const { sourceTaskId, targetTaskId } = hooks.useWatch(connection);

  const canvas = useCanvas();

  const sourceCenter = canvas.getLiveCenter(sourceTaskId);
  const targetCenter = canvas.getLiveCenter(targetTaskId);
  const sourceBounds = canvas.bounds.get(sourceTaskId);
  const targetBounds = canvas.bounds.get(targetTaskId);
  const [sourcePosition, targetPosition] = useMemo(() => {
    return [
      closestLivePoint(sourceCenter, sourceBounds, targetCenter),
      closestLivePoint(targetCenter, targetBounds, sourceCenter, -15),
    ];
  }, [sourceBounds, sourceCenter, targetCenter, targetBounds]);

  return (
    <Wire
      className="stroke-gray-5 stroke-2"
      sourcePosition={sourcePosition}
      targetPosition={targetPosition}
      data-source-id={sourceTaskId}
      data-target-id={targetTaskId}
      markerEnd="url(#arrow-end)"
    />
  );
}
