import { useTripProgress } from '@/components/trips/hooks.js';
import { hooks } from '@/store.js';
import {
	Box,
	Button,
	Card,
	CardGrid,
	Chip,
	Divider,
	H2,
	Heading,
	P,
	Text,
} from '@a-type/ui';
import { Link } from '@biscuits/client';
import { Trip } from '@trip-tick.biscuits/verdant';
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
			<Box col gap items="stretch">
				<H2>Trips</H2>
				<Box col gap items="center" surface="secondary" p="lg">
					<P>No trips yet</P>
					<AddTripButton>Plan one</AddTripButton>
				</Box>
			</Box>
		);
	}

	return (
		<Box col gap>
			<Heading render={<h2 />} emphasis="secondary">
				Trips
			</Heading>
			{!!future.length ?
				<CardGrid>
					{future.map((trip) => (
						<TripsListItem key={trip.get('id')} trip={trip} />
					))}
				</CardGrid>
			:	<Box dim col items="center" justify="center" p="lg" gap>
					<Text italic>No upcoming trips.</Text>
					<AddTripButton emphasis="default">Plan one</AddTripButton>
				</Box>
			}
			{!!past.length && showPast ?
				<>
					<Divider />
					<Heading render={<h2 />} emphasis="secondary">
						Past Trips
					</Heading>
					<CardGrid>
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
					style={{ alignSelf: 'center', opacity: 0.5 }}
					emphasis="ghost"
					onClick={() => setShowPast(true)}
				>
					Show past trips
				</Button>
			:	null}
		</Box>
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
				size={isPast ? 'sm' : 'md'}
				render={
					<Link to="/trips/$tripId" params={{ tripId: trip.get('id') }} />
				}
			>
				<Card.Title style={{ position: 'relative', zIndex: 1 }}>
					{name}
				</Card.Title>
				<Box style={{ zIndex: 1 }} wrap gap="sm" p="md" className="@mode-dense">
					{locationName && <Chip>{locationName}</Chip>}
					<Chip>
						{startsAt ? new Date(startsAt).toLocaleDateString() : 'Unscheduled'}
					</Chip>
					{!isPast && (
						<Chip>
							{completedItems} / {totalItems} items
						</Chip>
					)}
				</Box>
				{!isPast && (
					<Box
						surface="secondary"
						className="@mode-success"
						style={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							top: 0,
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
