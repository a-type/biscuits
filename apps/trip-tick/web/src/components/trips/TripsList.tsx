import { useTripProgress } from '@/components/trips/hooks.js';
import { hooks } from '@/store.js';
import { Button, Card, CardGrid, Chip, Divider, H2, P } from '@a-type/ui';
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
			if (startsAt && startsAt < now - 24 * 60 * 60 * 1000) {
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
				<div className="col rounded-lg p-8 bg-primary-wash">
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
				<CardGrid className="m-0 list-none p-0">
					{future.map((trip) => (
						<TripsListItem key={trip.get('id')} trip={trip} />
					))}
				</CardGrid>
			:	<div className="font-lg flex flex-col items-center justify-center gap-3 p-8 italic color-gray-dark">
					No upcoming trips.{' '}
					<AddTripButton emphasis="default">Plan one</AddTripButton>
				</div>
			}
			{!!past.length && showPast ?
				<>
					<Divider />
					<H2>Past Trips</H2>
					<CardGrid className="m-0 list-none p-0">
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
					emphasis="ghost"
					onClick={() => setShowPast(true)}
				>
					Show past trips
				</Button>
			:	null}
		</div>
	);
}

const now = Date.now();
function TripsListItem({ trip }: { trip: Trip }) {
	const { name, startsAt, endsAt, location } = hooks.useWatch(trip);
	hooks.useWatch(location);
	const locationName = location?.get('name');

	const isPast = endsAt && endsAt < now;

	const {
		value: completion,
		totalItems,
		completedItems,
	} = useTripProgress(trip);

	return (
		<Card>
			<Card.Main
				compact={!!isPast}
				render={
					<Link to={`/trips/${trip.get('id')}`} className="relative bg-white" />
				}
			>
				<Card.Title className="relative z-1">{name}</Card.Title>
				<div className="relative z-1 flex flex-row flex-wrap gap-1 px-2 text-xs">
					{locationName && <Chip className="bg-white">{locationName}</Chip>}
					<Chip className="bg-white">
						{startsAt ? new Date(startsAt).toLocaleDateString() : 'Unscheduled'}
					</Chip>
					{!isPast && (
						<Chip className="bg-white">
							{completedItems} / {totalItems} items
						</Chip>
					)}
				</div>
				{!isPast && (
					<div
						className="absolute bottom-0 left-0 top-0 bg-accent-wash"
						style={{
							width: `${completion * 100}%`,
						}}
					/>
				)}
			</Card.Main>
			<Card.Footer>
				<Card.Actions>
					<TripMenu tripId={trip.get('id')} />
				</Card.Actions>
			</Card.Footer>
		</Card>
	);
}
