import { ObjectEntity } from '@floorplan.biscuits/verdant';
import { MotionValue, useMotionValue } from 'motion/react';
import { useEffect } from 'react';

export function useVerdantMotion<
	T extends { [key: string]: any },
	K extends keyof T,
>(parent: ObjectEntity<any, T>, key: K): MotionValue<T[K]> {
	const value = useMotionValue(parent.get(key));
	useEffect(() =>
		parent.subscribeToField(key, 'change', (newValue) => value.set(newValue)),
	);
	return value;
}
