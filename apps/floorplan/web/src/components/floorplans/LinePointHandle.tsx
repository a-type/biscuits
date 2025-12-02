import { hooks } from '@/hooks.js';
import { useMotionPoint } from '@/hooks/useVerdantMotion.js';
import { useViewport } from '@a-type/ui';
import { FloorLinesItemStart } from '@floorplan.biscuits/verdant';
import { useDrag } from '@use-gesture/react';
import { motion } from 'motion/react';
import { useFloor } from './FloorProvider.jsx';
import {
	applyPointSnap,
	getPrimarySnapPoint,
	getSnapChain,
} from './pointLogic.js';
import { computeConstrainedInput } from './positioning.js';

export interface LinePointHandleProps {
	point: FloorLinesItemStart;
	oppositePoint: FloorLinesItemStart;
}

export function LinePointHandle({
	point,
	oppositePoint,
}: LinePointHandleProps) {
	const { x, y } = useMotionPoint(point);
	const { x: oppositeX, y: oppositeY } = useMotionPoint(oppositePoint);

	const { snap } = hooks.useWatch(point); // side effect.
	const floor = useFloor();
	const snapChain = getSnapChain(floor, point);

	const viewport = useViewport();

	const bind = useDrag((state) => {
		const result = computeConstrainedInput({
			input: viewport.viewportToWorld({
				x: state.xy[0],
				y: state.xy[1],
			}),
			first: false, // important otherwise it mutates startX/startY... could be cleaner...
			startX: oppositeX,
			startY: oppositeY,
			floor,
			filterSnap: (lineId, end, snapCandidate) => {
				if (snapCandidate === point || snapCandidate === oppositePoint) {
					return false;
				}
				// avoid circular snap relationships
				if (getPrimarySnapPoint(floor, snapCandidate) === point) {
					return false;
				}
				// avoid snapping to our other line point or any snap primary of it
				if (
					getPrimarySnapPoint(floor, snapCandidate) ===
					getPrimarySnapPoint(floor, oppositePoint)
				) {
					return false;
				}
				return !snapChain.has(lineId, end);
			},
		});
		applyPointSnap(floor, point, result);
	});

	return (
		<motion.circle
			cx={x}
			cy={y}
			r={6}
			className="fill-white stroke-inherit cursor-grab touch-none"
			strokeWidth={2}
			data-snapped-to={
				snap ? `${snap.get('lineId')}-${snap.get('side')}` : undefined
			}
			{...(bind() as any)}
		/>
	);
}
