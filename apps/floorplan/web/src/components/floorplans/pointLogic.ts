import {
	Floor,
	FloorLinesItemStart,
	FloorLinesItemStartSnap,
} from '@floorplan.biscuits/verdant';
import { PointPositionResult } from './positioning.js';

export function getPointValue(
	floor: Floor,
	point: FloorLinesItemStart,
	val: 'x' | 'y',
): number {
	const primary = getPrimarySnapPoint(floor, point);
	return primary.get(val);
}

export function getPoint(floor: Floor, point: FloorLinesItemStart) {
	const primary = getPrimarySnapPoint(floor, point);
	return {
		x: primary.get('x'),
		y: primary.get('y'),
	};
}

export function getPrimarySnapPoint(floor: Floor, point: FloorLinesItemStart) {
	const snap = point.get('snap');
	if (!snap) {
		return point;
	}
	const line = floor
		.get('lines')
		.find((l) => l.get('id') === snap.get('lineId'));
	if (!line) {
		return point;
	}
	if (snap.get('side') === 'start') {
		return line.get('start');
	} else {
		return line.get('end');
	}
}

class SnapChain {
	#set = new Set<string>();
	add(lineId: string, side: 'start' | 'end') {
		this.#set.add(`${lineId}|${side}`);
	}
	has(lineId: string, side: 'start' | 'end') {
		return this.#set.has(`${lineId}|${side}`);
	}
}
export function getSnapChain(floor: Floor, point: FloorLinesItemStart) {
	const chain = new SnapChain();
	let currentPoint: FloorLinesItemStart | null = point;
	while (true) {
		const snap: FloorLinesItemStartSnap | null = currentPoint.get('snap');
		if (!snap) {
			break;
		}
		const lineId = snap.get('lineId');
		const side: 'start' | 'end' = snap.get('side');
		if (chain.has(lineId, side)) {
			// already seen this snap, break to avoid infinite loop
			break;
		}
		chain.add(lineId, side);
		const line = floor.get('lines').find((l) => l.get('id') === lineId);
		if (!line) {
			break;
		}
		currentPoint = side === 'start' ? line.get('start') : line.get('end');
	}
	return chain;
}

export function applyPointSnap(
	floor: Floor,
	point: FloorLinesItemStart,
	result: PointPositionResult,
) {
	const pointPrimary = getPrimarySnapPoint(floor, point);
	pointPrimary.update({
		x: result.x,
		y: result.y,
	});

	if (result.snappedTo) {
		const snap = result.snappedTo;
		if (snap.value === pointPrimary) {
			// avoid circular loops of snapping to another point that
			// is snapped to me
			return;
		}
		const primary = getPrimarySnapPoint(floor, snap.value);
		primary.update({
			x: result.x,
			y: result.y,
		});
		point.set('snap', {
			lineId: snap.lineId,
			side: snap.side,
		});
	}
}

export function updatePointOrSnap(
	floor: Floor,
	point: FloorLinesItemStart,
	position: { x: number; y: number },
) {
	const primary = getPrimarySnapPoint(floor, point);
	primary.update({
		x: position.x,
		y: position.y,
	});
}
