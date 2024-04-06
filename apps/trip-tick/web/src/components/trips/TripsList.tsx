import { useTripProgress } from '@/components/trips/hooks.js';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import {
  CardActions,
  CardContent,
  CardFooter,
  CardGrid,
  CardMain,
  CardRoot,
  CardTitle,
} from '@a-type/ui/components/card';
import { Trip } from '@trip-tick.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import { TripMenu } from './TripMenu.jsx';
import { H2, P } from '@a-type/ui/components/typography';
import { AddTripButton } from './AddTripButton.jsx';
import { Divider } from '@a-type/ui/components/divider';
import { Chip } from '@a-type/ui/components/chip';
import { useState } from 'react';
import { AddListButton } from '../lists/AddListButton.jsx';

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
      if (startsAt && startsAt < Date.now()) {
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

  if (!hasLists) {
    return (
      <div className="flex flex-col gap-4 items-start">
        <H2>Welcome!</H2>
        <P>
          Trip Tick is a list-making app purpose-made for planning what to pack
          for your next trip.
        </P>
        <P>To get started, you need to create your first packing list.</P>
        <AddListButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {!!future.length ? (
        <CardGrid className="list-none p-0 m-0">
          {future.map((trip) => (
            <TripsListItem key={trip.get('id')} trip={trip} />
          ))}
        </CardGrid>
      ) : (
        <div className="text-gray-5 p-8 italic font-lg flex flex-col gap-3 items-center justify-center">
          No upcoming trips.{' '}
          <AddTripButton color="default">Plan one</AddTripButton>
        </div>
      )}
      {!!past.length && showPast ? (
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
      ) : (
        <Button
          className="self-center opacity-50"
          color="ghost"
          onClick={() => setShowPast(true)}
        >
          Show past trips
        </Button>
      )}
    </div>
  );
}

function TripsListItem({ trip }: { trip: Trip }) {
  const { name, startsAt, location } = hooks.useWatch(trip);
  hooks.useWatch(location);
  const locationName = location?.get('name');

  const isPast = startsAt && startsAt < Date.now();

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
          <CardContent className="text-xs relative z-1 flex flex-row gap-1 flex-wrap">
            {locationName && <Chip className="bg-white">{locationName}</Chip>}
            <Chip className="bg-white">
              {startsAt
                ? new Date(startsAt).toLocaleDateString()
                : 'Unscheduled'}
            </Chip>
            {!isPast && (
              <Chip className="bg-white">
                {completedItems} / {totalItems} items
              </Chip>
            )}
          </CardContent>
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
