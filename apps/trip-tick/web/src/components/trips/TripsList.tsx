import { useTripProgress } from '@/components/trips/hooks.js';
import { hooks } from '@/store.js';
import {
	Button,
	CardActions,
	CardFooter,
	CardGrid,
	CardMain,
	CardRoot,
	CardTitle,
	Chip,
	Divider,
	H2,
	P,
} from '@a-type/ui';
import { Trip } from '@trip-tick.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import { useState } from 'react';
import { AddTripButton } from './AddTripButton.jsx';
import { TripMenu } from './TripMenu.jsx';

export interface TripsListProps {}

export function TripsList({}: TripsListProps) {
	const [trips, tools] = hooks.useAllTripsInfinite({
		pageSize: 10,
		key: 'trips',
		index: {
			where: 'createdAt',
			order: 'desc',
		},
	});

	const [past, future] = trips.reduce(
		([past, future], trip) => {
			const startsAt = trip.get('startsAt');
			if (startsAt && startsAt < Date.now() - 24 * 60 * 60 * 1000) {
				return [[...past, trip], future];
			} else {
				return [past, [...future, trip]];
			}
		},
		[[], []] as [Trip[], Trip[]],
	);

	const [showPast, setShowPast] = useState(false);

	// just to see if we have some
	const [lists] = hooks.useAllListsPaginated({
		pageSize: 1,
	});
	const hasLists = lists.length > 0;

	if (!trips.length && !hasLists) {
		return null;
	}

	if (!trips.length) {
		return (
			<div className="col items-stretch">
				<H2>Trips</H2>
				<div className="col bg-primary-wash rounded-lg p-8">
					<P>No trips yet</P>
					<AddTripButton>Plan one</AddTripButton>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<H2>Trips</H2>
			{!!future.length ?
				<CardGrid className="list-none p-0 m-0">
					{future.map((trip) => (
						<TripsListItem key={trip.get('id')} trip={trip} />
					))}
				</CardGrid>
			:	<div className="text-gray-5 p-8 italic font-lg flex flex-col gap-3 items-center justify-center">
					No upcoming trips.{' '}
					<AddTripButton color="default">Plan one</AddTripButton>
				</div>
			}
			{!!past.length && showPast ?
				<>
					<Divider />
					<H2>Past Trips</H2>
					<CardGrid className="list-none p-0 m-0">
						{past.map((trip) => (
							<TripsListItem key={trip.get('id')} trip={trip} />
						))}
					</CardGrid>
					{tools.hasMore && (
						<Button onClick={() => tools.loadMore()}>Show older</Button>
					)}
				</>
			: !!past.length ?
				<Button
					className="self-center opacity-50"
					color="ghost"
					onClick={() => setShowPast(true)}
				>
					Show past trips
				</Button>
			:	null}
		</div>
	);
}

function TripsListItem({ trip }: { trip: Trip }) {
	const { name, startsAt, endsAt, location } = hooks.useWatch(trip);
	hooks.useWatch(location);
	const locationName = location?.get('name');

	const isPast = endsAt && endsAt < Date.now();

	const {
		value: completion,
		totalItems,
		completedItems,
	} = useTripProgress(trip);

	return (
		<CardRoot>
			<CardMain compact={!!isPast} asChild>
				<Link to={`/trips/${trip.get('id')}`} className="relative bg-white">
					<CardTitle className="relative z-1">{name}</CardTitle>
					<div className="text-xs px-2 relative z-1 flex flex-row gap-1 flex-wrap">
						{locationName && <Chip className="bg-white">{locationName}</Chip>}
						<Chip className="bg-white">
							{startsAt ?
								new Date(startsAt).toLocaleDateString()
							:	'Unscheduled'}
						</Chip>
						{!isPast && (
							<Chip className="bg-white">
								{completedItems} / {totalItems} items
							</Chip>
						)}
					</div>
					{!isPast && (
						<div
							className="absolute left-0 top-0 bottom-0 bg-accent-wash"
							style={{
								width: `${completion * 100}%`,
							}}
						/>
					)}
				</Link>
			</CardMain>
			<CardFooter>
				<CardActions>
					<TripMenu tripId={trip.get('id')} />
				</CardActions>
			</CardFooter>
		</CardRoot>
	);
}
