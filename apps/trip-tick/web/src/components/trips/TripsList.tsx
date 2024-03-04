import { useTripProgress } from '@/components/trips/hooks.js';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import {
  CardFooter,
  CardGrid,
  CardMain,
  CardRoot,
} from '@a-type/ui/components/card';
import { Trip } from '@packing-list/verdant';
import { Link } from '@verdant-web/react-router';

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

  return (
    <div>
      <CardGrid className="list-none p-0 m-0">
        {trips.map((trip) => (
          <TripsListItem key={trip.get('id')} trip={trip} />
        ))}
      </CardGrid>
      {tools.hasMore && (
        <Button onClick={() => tools.loadMore()}>Show older</Button>
      )}
    </div>
  );
}

function TripsListItem({ trip }: { trip: Trip }) {
  const { name, startsAt } = hooks.useWatch(trip);

  const {
    value: completion,
    totalItems,
    completedItems,
  } = useTripProgress(trip);

  return (
    <CardRoot>
      <CardMain asChild>
        <Link to={`/trips/${trip.get('id')}`} className="relative bg-white">
          <span className="relative z-1">{name}</span>
          <div
            className="absolute left-0 top-0 bottom-0 bg-accent-wash"
            style={{
              width: `${completion * 100}%`,
            }}
          />
        </Link>
      </CardMain>
      <CardFooter className="text-xs">
        {startsAt ? new Date(startsAt).toLocaleDateString() : 'Unscheduled'} |{' '}
        {completedItems} / {totalItems} items
      </CardFooter>
    </CardRoot>
  );
}
