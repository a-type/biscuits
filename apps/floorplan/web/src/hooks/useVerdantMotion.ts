import {
	getPointValue,
	getPrimarySnapPoint,
} from '@/components/floorplans/pointLogic.js';
import { hooks } from '@/hooks.js';
import { Floor, FloorLinesItemStart } from '@floorplan.biscuits/verdant';
import { MotionValue, useMotionValue } from 'motion/react';
import { useEffect } from 'react';

export function useMotionPoint(
	floor: Floor,
	point: FloorLinesItemStart,
): {
	x: MotionValue<number>;
	y: MotionValue<number>;
} {
	const x = useMotionValue(getPointValue(floor, point, 'x'));
	const y = useMotionValue(getPointValue(floor, point, 'y'));

	hooks.useWatch(point).snap; // side effect.

	useEffect(() => {
		const primary = getPrimarySnapPoint(floor, point);
		const unsubPoint = primary.subscribe('change', () => {
			x.set(getPointValue(floor, primary, 'x'));
			y.set(getPointValue(floor, primary, 'y'));
		});

		return () => {
			unsubPoint();
		};
	}, [floor, point, x, y]);

	return { x, y };
}
