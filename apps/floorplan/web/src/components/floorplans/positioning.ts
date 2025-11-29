import { Floor, FloorLinesItemStart } from '@floorplan.biscuits/verdant';
import { MotionValue } from 'motion/react';
import { editorState } from './editorState.js';
import { SNAP_DISTANCE } from './NewLine.jsx';

export function getPointPosition({
	first,
	startX,
	startY,
	floor,
	pos,
}: {
	first: boolean;
	startX: MotionValue<number>;
	startY: MotionValue<number>;
	floor: Floor;
	pos: { x: number; y: number };
}) {
	let cornerSnapped = false;
	if (editorState.constraints.snapCorners) {
		// are any points of others lines within snap distance?
		const lines = floor.get('lines');
		let closest: { point: FloorLinesItemStart; distance: number } | null = null;
		for (const line of lines) {
			const start = line.get('start');
			const end = line.get('end');
			const distToStart = Math.hypot(
				start.get('x') - pos.x,
				start.get('y') - pos.y,
			);
			const distToEnd = Math.hypot(end.get('x') - pos.x, end.get('y') - pos.y);
			if (
				distToStart < SNAP_DISTANCE &&
				(!closest || distToStart < closest.distance)
			) {
				closest = { point: start, distance: distToStart };
			} else if (
				distToEnd < SNAP_DISTANCE &&
				(!closest || distToEnd < closest.distance)
			) {
				closest = { point: end, distance: distToEnd };
			}
		}
		if (closest) {
			pos.x = closest.point.get('x');
			pos.y = closest.point.get('y');
			cornerSnapped = true;
		}
	}

	if (first) {
		startX.set(pos.x);
		startY.set(pos.y);
	} else if (editorState.constraints.angles && !cornerSnapped) {
		const dx = pos.x - startX.get();
		const dy = pos.y - startY.get();
		const angle = Math.atan2(dy, dx);
		const length = Math.sqrt(dx * dx + dy * dy);
		const constrainedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
		pos.x = startX.get() + length * Math.cos(constrainedAngle);
		pos.y = startY.get() + length * Math.sin(constrainedAngle);
	}

	return pos;
}
