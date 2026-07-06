import { Progress } from '@a-type/ui';
import { Trip } from '@trip-tick.biscuits/verdant';
import { useTripProgress } from './hooks.js';

export interface TripGlobalProgressProps {
	trip: Trip;
}

export function TripGlobalProgress({ trip }: TripGlobalProgressProps) {
	const { value } = useTripProgress(trip);
	console.log(value);

	return <Progress value={value} max={1} style={{ width: '100%' }} />;
}
