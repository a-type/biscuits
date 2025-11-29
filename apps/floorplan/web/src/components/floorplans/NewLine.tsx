import { useViewport } from '@a-type/ui';
import { Floor, id } from '@floorplan.biscuits/verdant';
import { useDrag } from '@use-gesture/react';
import { useMotionValue } from 'motion/react';
import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { editorState } from './editorState.js';
import { LineRenderer } from './LineRenderer.jsx';
import { getPointPosition } from './positioning.js';

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

	useDrag(
		(state) => {
			const pos = getPointPosition({
				pos: viewport.viewportToWorld({
					x: state.xy[0],
					y: state.xy[1],
				}),
				first: state.first,
				startX: toolStartX,
				startY: toolStartY,
				floor,
			});

			const length = Math.sqrt(state.distance[0] ** 2 + state.distance[1] ** 2);
			if (length > 10) {
				setToolActive(true);
			}

			if (state.last) {
				setToolActive(false);
				if (state.tap || length <= 10 || !floor) {
					return;
				}
				const lineId = id();
				floor.get('lines').push({
					id: lineId,
					start: {
						x: toolStartX.get(),
						y: toolStartY.get(),
					},
					end: pos,
				});
				editorState.selections = [lineId];
			}

			toolEndX.set(pos.x);
			toolEndY.set(pos.y);
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
		<LineRenderer
			startX={toolStartX}
			startY={toolStartY}
			endX={toolEndX}
			endY={toolEndY}
		/>
	);
}
