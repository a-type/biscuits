import { Progress, ProgressIndicator } from '@radix-ui/react-progress';
import { Trip } from '@trip-tick.biscuits/verdant';
import { useTripProgress } from './hooks.js';

export interface TripGlobalProgressProps {
	trip: Trip;
}

export function TripGlobalProgress({ trip }: TripGlobalProgressProps) {
	const { value } = useTripProgress(trip);

	return (
		<Progress
			value={value}
			className="w-full relative overflow-hidden border border-default rounded-full"
		>
			<ProgressIndicator
				className="bg-accent w-full h-6px"
				style={{
					transform: `translateX(-${100 * (1 - value)}%`,
				}}
			/>
		</Progress>
	);
}
