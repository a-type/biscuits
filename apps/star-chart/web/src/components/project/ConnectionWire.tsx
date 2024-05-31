import { hooks } from '@/store.js';
import { Connection } from '@star-chart.biscuits/verdant';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { Wire } from '../canvas/Wire.jsx';

export interface ConnectionWireProps {
  connection: Connection;
}

export function ConnectionWire({ connection }: ConnectionWireProps) {
  const { sourceTaskId, targetTaskId } = hooks.useWatch(connection);

  const canvas = useCanvas();

  return (
    <Wire
      className="stroke-black stroke-2"
      sourcePosition={canvas.positions.get(sourceTaskId)}
      targetPosition={canvas.positions.get(targetTaskId)}
      data-source-id={sourceTaskId}
      data-target-id={targetTaskId}
    />
  );
}
