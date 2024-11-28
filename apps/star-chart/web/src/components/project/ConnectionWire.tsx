import { hooks } from '@/store.js';
import { clsx } from '@a-type/ui';
import { SpringValue } from '@react-spring/web';
import { Connection } from '@star-chart.biscuits/verdant';
import { useCallback, useMemo } from 'react';
import { CanvasGestureInfo } from '../canvas/Canvas.js';
import { useIsPendingSelection, useIsSelected } from '../canvas/canvasHooks.js';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { SvgPortal } from '../canvas/CanvasSvgLayer.jsx';
import { closestLivePoint } from '../canvas/math.js';
import { Wire } from '../canvas/Wire.jsx';
import { ConnectionMenu } from './ConnectionMenu.jsx';

export interface ConnectionWireProps {
	connection: Connection;
}

const ZERO_BOUNDS = { width: new SpringValue(0), height: new SpringValue(0) };

export function ConnectionWire({ connection }: ConnectionWireProps) {
	const { sourceTaskId, targetTaskId, id } = hooks.useWatch(connection);
	const sourceTask = hooks.useTask(sourceTaskId);
	hooks.useWatch(sourceTask);
	const targetTask = hooks.useTask(targetTaskId);
	hooks.useWatch(targetTask);

	const canvas = useCanvas();
	const onTap = useCallback(
		(info: CanvasGestureInfo) => {
			if (info.shift) {
				canvas.selections.add(id);
			} else {
				canvas.selections.set([id]);
			}
		},
		[id],
	);

	const { selected, exclusive } = useIsSelected(id);
	const pendingSelect = useIsPendingSelection(id);

	const sourceCenter = canvas.getLiveCenter(sourceTaskId);
	const targetCenter = canvas.getLiveCenter(targetTaskId);
	const sourceBounds = canvas.getLiveSize(sourceTaskId) ?? ZERO_BOUNDS;
	const targetBounds = canvas.getLiveSize(targetTaskId) ?? ZERO_BOUNDS;

	const [sourcePosition, targetPosition] = useMemo(() => {
		return [
			closestLivePoint(sourceCenter, sourceBounds, targetCenter),
			closestLivePoint(targetCenter, targetBounds, sourceCenter, -15),
		];
	}, [sourceBounds, sourceCenter, targetCenter, targetBounds]);

	const sourceTaskIsComplete = !!sourceTask?.get('completedAt');
	const targetTaskIsComplete = !!targetTask?.get('completedAt');

	return (
		<>
			<SvgPortal layerId="connections">
				<Wire
					className={clsx(
						'layer-components:(stroke-accent-light stroke-2 [&[data-hovered=true]]:stroke-primary z-1)',
						selected && 'stroke-primary',
						!selected && pendingSelect && 'stroke-primary',
						sourceTaskIsComplete &&
							targetTaskIsComplete &&
							'opacity-[calc(var(--zoom,1)*var(--zoom,1)*0.5)]',
					)}
					hoverClassName="stroke-primary-wash"
					sourcePosition={sourcePosition}
					targetPosition={targetPosition}
					data-source-id={sourceTaskId}
					data-target-id={targetTaskId}
					markerEnd="url(#arrow-end)"
					strokeDasharray={sourceTaskIsComplete ? '0' : '4 4'}
					onTap={onTap}
					id={connection.get('id')}
					metadata={{ type: 'connection' }}
				/>
			</SvgPortal>
			{exclusive && <ConnectionMenu connection={connection} />}
		</>
	);
}
