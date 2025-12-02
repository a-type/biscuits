import { hooks } from '@/hooks.js';
import { useViewport } from '@a-type/ui';
import { Floor, id } from '@floorplan.biscuits/verdant';
import { useDrag } from '@use-gesture/react';
import { useMotionValue } from 'motion/react';
import { useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import { editorState } from './editorState.js';
import { LineRenderer } from './LineRenderer.jsx';
import { applyPointSnap } from './pointLogic.js';
import { computeConstrainedInput, PointPositionResult } from './positioning.js';

export interface NewLineProps {
	floor: Floor;
}

export const SNAP_DISTANCE = 30;

export function NewLine({ floor }: NewLineProps) {
	const viewport = useViewport();

	const stateSnap = useSnapshot(editorState);
	const enabled = stateSnap.tool === 'line';
	const [toolActive, setToolActive] = useState(false);
	const toolStartX = useMotionValue(0);
	const toolStartY = useMotionValue(0);
	const toolEndX = useMotionValue(0);
	const toolEndY = useMotionValue(0);
	const initialRef = useRef<PointPositionResult | null>(null);

	const client = hooks.useClient();

	useDrag(
		(state) => {
			const result = computeConstrainedInput({
				input: viewport.viewportToWorld({
					x: state.xy[0],
					y: state.xy[1],
				}),
				first: state.first,
				startX: toolStartX,
				startY: toolStartY,
				floor,
			});
			if (state.first) {
				initialRef.current = result;
			}

			const length = Math.sqrt(state.distance[0] ** 2 + state.distance[1] ** 2);
			if (length > 10) {
				setToolActive(true);
			}

			if (state.last) {
				client
					.batch()
					.run(() => {
						setToolActive(false);
						if (state.tap || length <= 10 || !floor || !initialRef.current) {
							return;
						}
						const lineId = id();
						floor.get('lines').push({
							id: lineId,
							start: {
								x: initialRef.current.x,
								y: initialRef.current.y,
							},
							end: {
								x: result.x,
								y: result.y,
							},
						});
						const line = floor.get('lines').find((l) => l.get('id') === lineId);
						if (!line) {
							throw new Error('Unknown error: Failed to create line');
						}
						applyPointSnap(floor, line.get('start'), initialRef.current);
						applyPointSnap(floor, line.get('end'), result);
						initialRef.current = null;
						editorState.selections = [lineId];
					})
					.commit();
			}

			toolEndX.set(result.x);
			toolEndY.set(result.y);
		},
		{
			target: viewport.element,
			enabled,
		},
	);

	if (!enabled || !toolActive) {
		return null;
	}

	return (
		<g className="stroke-black">
			<LineRenderer
				startX={toolStartX}
				startY={toolStartY}
				endX={toolEndX}
				endY={toolEndY}
			/>
		</g>
	);
}
