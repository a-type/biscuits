import { hooks } from '@/store.js';
import { Connection } from '@star-chart.biscuits/verdant';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { Wire } from '../canvas/Wire.jsx';
import { useCallback, useMemo } from 'react';
import { closestLivePoint } from '../canvas/math.js';
import { ProjectCanvasState } from './state.js';
import { Vector2 } from '../canvas/types.js';
import { SvgPortal } from '../canvas/CanvasSvgLayer.jsx';
import { ConnectionMenu } from './ConnectionMenu.jsx';

export interface ConnectionWireProps {
  connection: Connection;
}

export function ConnectionWire({ connection }: ConnectionWireProps) {
  const { sourceTaskId, targetTaskId, id } = hooks.useWatch(connection);
  const sourceTask = hooks.useTask(sourceTaskId);
  hooks.useWatch(sourceTask);

  const actor = ProjectCanvasState.useActorRef();
  const onTap = useCallback(
    (pos: Vector2) => {
      actor.send({ type: 'selectConnection', connectionId: id });
    },
    [id],
  );
  const selectedId = ProjectCanvasState.useSelector(
    (ctx) => ctx.context.selectedConnection,
  );
  const isSelected = selectedId === id;

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
    <>
      <SvgPortal layerId="connections">
        <Wire
          className="stroke-accent-light stroke-2 [&[data-hovered=true]]:stroke-primary"
          hoverClassName="stroke-primary-wash"
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          data-source-id={sourceTaskId}
          data-target-id={targetTaskId}
          markerEnd="url(#arrow-end)"
          strokeDasharray={sourceTask?.get('completedAt') ? '0' : '4 4'}
          onTap={onTap}
          id={connection.get('id')}
        />
      </SvgPortal>
      {isSelected && <ConnectionMenu connection={connection} />}
    </>
  );
}
