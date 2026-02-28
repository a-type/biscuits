import { hooks } from '@/hooks.js';
import { useViewport } from '@a-type/ui';
import { Floor, id } from '@floorplan.biscuits/verdant';
import { useDrag } from '@use-gesture/react';
import { useMotionValue, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import { editorState } from './editorState.js';
import { applyPointSnap } from './pointLogic.js';
import { computeConstrainedInput, PointPositionResult } from './positioning.js';
import { ShapeRenderer } from './ShapeRenderer.jsx';

export interface NewShapeProps {
	floor: Floor;
}

export function NewShape({ floor }: NewShapeProps) {
	const viewport = useViewport();

	const stateSnap = useSnapshot(editorState);
	const enabled = stateSnap.tool === 'shape';
	const [toolActive, setToolActive] = useState(false);
	const toolStartX = useMotionValue(0);
	const toolStartY = useMotionValue(0);
	const toolEndX = useMotionValue(0);
	const toolEndY = useMotionValue(0);

	const width = useTransform(() => Math.abs(toolEndX.get() - toolStartX.get()));
	const height = useTransform(() =>
		Math.abs(toolEndY.get() - toolStartY.get()),
	);
	const angle = useMotionValue(0);

	const initialRef = useRef<PointPositionResult | null>(null);

	const client = hooks.useClient();

	useDrag(
		(state) => {
			if (editorState.gestureClaimedByManipulation) {
				return;
			}

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

			setToolActive(true);

			toolEndX.set(result.x);
			toolEndY.set(result.y);

			if (state.last) {
				const initial = initialRef.current;
				if (!initial) {
					return;
				}
				client
					.batch()
					.run(() => {
						setToolActive(false);
						const shapeId = id();
						floor.get('shapes').set(shapeId, {
							id: shapeId,
							center: {
								x: initial.x,
								y: initial.y,
							},
							width: Math.max(1, Math.abs(result.x - initial.x)),
							height: Math.max(1, Math.abs(result.y - initial.y)),
							type: stateSnap.shapeType,
						});
						const shape = floor.get('shapes').get(shapeId);
						if (!shape) {
							throw new Error('Shape not found after creation');
						}
						applyPointSnap(floor, shape.get('center'), initial);
						initialRef.current = null;
						editorState.selections = [shapeId];
					})
					.commit();
			}
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
			<ShapeRenderer
				centerX={toolStartX}
				centerY={toolStartY}
				height={height}
				width={width}
				type={stateSnap.shapeType}
				angle={angle}
			/>
		</g>
	);
}
