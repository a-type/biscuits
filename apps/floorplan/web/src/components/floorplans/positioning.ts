import { Floor, FloorLinesItemStart } from '@floorplan.biscuits/verdant';
import { MotionValue } from 'motion/react';
import { editorState } from './editorState.js';
import { SNAP_DISTANCE } from './NewLine.jsx';
import { getPointValue } from './pointLogic.js';

export interface PointPositionResult {
	x: number;
	y: number;
	snappedTo?: {
		lineId: string;
		side: 'start' | 'end';
		value: FloorLinesItemStart;
	};
}

export function getPointPosition({
	first,
	startX,
	startY,
	floor,
	input,
	filterSnap,
}: {
	first: boolean;
	startX: MotionValue<number>;
	startY: MotionValue<number>;
	floor: Floor;
	input: { x: number; y: number };
	filterSnap?: (
		lineId: string,
		end: 'start' | 'end',
		point: FloorLinesItemStart,
	) => boolean;
}) {
	const result: PointPositionResult = {
		x: input.x,
		y: input.y,
	};
	if (editorState.constraints.snapCorners) {
		// are any points of others lines within snap distance?

		const lines = floor.get('lines');
		let closest: {
			lineId: string;
			point: 'start' | 'end';
			value: FloorLinesItemStart;
			distance: number;
		} | null = null;
		for (const line of lines) {
			const start = line.get('start');
			const end = line.get('end');
			const distToStart = Math.hypot(
				getPointValue(floor, start, 'x') - input.x,
				getPointValue(floor, start, 'y') - input.y,
			);
			const distToEnd = Math.hypot(
				getPointValue(floor, end, 'x') - input.x,
				getPointValue(floor, end, 'y') - input.y,
			);
			if (
				distToStart < SNAP_DISTANCE &&
				(!closest || distToStart < closest.distance) &&
				(!filterSnap || filterSnap(line.get('id'), 'start', start))
			) {
				closest = {
					lineId: line.get('id'),
					point: 'start',
					value: start,
					distance: distToStart,
				};
			} else if (
				distToEnd < SNAP_DISTANCE &&
				(!closest || distToEnd < closest.distance) &&
				(!filterSnap || filterSnap(line.get('id'), 'end', end))
			) {
				closest = {
					lineId: line.get('id'),
					point: 'end',
					value: end,
					distance: distToEnd,
				};
			}
		}
		if (closest) {
			result.x = getPointValue(floor, closest.value, 'x');
			result.y = getPointValue(floor, closest.value, 'y');
			result.snappedTo = {
				value: closest.value,
				lineId: closest.lineId,
				side: closest.point,
			};
		}
	}

	if (first) {
		startX.set(result.x);
		startY.set(result.y);
	} else if (editorState.constraints.angles && !result.snappedTo) {
		const dx = result.x - startX.get();
		const dy = result.y - startY.get();
		const angle = Math.atan2(dy, dx);
		const length = Math.sqrt(dx * dx + dy * dy);
		const constrainedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
		result.x = startX.get() + length * Math.cos(constrainedAngle);
		result.y = startY.get() + length * Math.sin(constrainedAngle);
	}

	return result;
}
