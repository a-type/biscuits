import { hooks } from '@/hooks.js';
import { useMotionPoint } from '@/hooks/useVerdantMotion.js';
import { useViewport } from '@a-type/ui';
import { Floor, FloorLinesItemStart } from '@floorplan.biscuits/verdant';
import { useDrag } from '@use-gesture/react';
import { motion } from 'motion/react';
import {
	applyPointSnap,
	getPrimarySnapPoint,
	getSnapChain,
} from './pointLogic.js';
import { getPointPosition } from './positioning.js';

export interface LinePointHandleProps {
	floor: Floor;
	point: FloorLinesItemStart;
	oppositePoint: FloorLinesItemStart;
}

export function LinePointHandle({
	point,
	oppositePoint,
	floor,
}: LinePointHandleProps) {
	const { x, y } = useMotionPoint(floor, point);
	const { x: oppositeX, y: oppositeY } = useMotionPoint(floor, oppositePoint);

	const { snap } = hooks.useWatch(point); // side effect.
	const snapChain = getSnapChain(floor, point);

	const viewport = useViewport();

	const bind = useDrag((state) => {
		const result = getPointPosition({
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
