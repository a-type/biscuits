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
			className="relative w-full overflow-hidden border border-default rounded-full"
		>
			<ProgressIndicator
				className="h-6px w-full bg-accent"
				style={{
					transform: `translateX(-${100 * (1 - value)}%`,
				}}
			/>
		</Progress>
	);
}
