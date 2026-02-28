import { useFloor } from '@/components/floorplans/FloorProvider.jsx';
import {
	getPointValue,
	getPrimarySnapPoint,
} from '@/components/floorplans/pointLogic.js';
import { hooks } from '@/hooks.js';
import {
	ObjectEntity,
	FloorLinesValueStart as SnapPoint,
} from '@floorplan.biscuits/verdant';
import { MotionValue, useMotionValue } from 'motion/react';
import { useEffect } from 'react';

export function useMotionPoint(
	point: SnapPoint,
	{ value = 0 }: { value?: number } = {},
): {
	x: MotionValue<number>;
	y: MotionValue<number>;
} {
	const floor = useFloor();
	const x = useMotionValue(getPointValue(floor, point, 'x'));
	const y = useMotionValue(getPointValue(floor, point, 'y'));

	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	hooks.useWatch(point)?.snap; // side effect.

	useEffect(() => {
		const primary = getPrimarySnapPoint(floor, point);
		const unsubPoint = primary.subscribe('change', () => {
			x.set(getPointValue(floor, primary, 'x'));
			y.set(getPointValue(floor, primary, 'y'));
		});

		return () => {
			unsubPoint();
		};
	}, [floor, point, x, y, value]);

	return { x, y };
}

export function useMotionNumber<T extends {}, K extends keyof T>(
	liveObject: ObjectEntity<any, T, any>,
	key: K,
): MotionValue<number> {
	const value = useMotionValue(liveObject.get(key) as unknown as number);

	useEffect(() => {
		const unsub = liveObject.subscribe('change', () => {
			value.set(liveObject.get(key) as unknown as number);
		});
		return () => {
			unsub();
		};
	}, [liveObject, key, value]);

	return value;
}
