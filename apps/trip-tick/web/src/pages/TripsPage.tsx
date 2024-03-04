import { AddTripButton } from '@/components/trips/AddTripButton.jsx';
import { TripsList } from '@/components/trips/TripsList.jsx';
import { PageContent, PageNowPlaying } from '@a-type/ui/components/layouts';

export interface TripsPageProps {}

export function TripsPage({}: TripsPageProps) {
  return (
    <PageContent>
      <TripsList />
      <PageNowPlaying unstyled>
        <AddTripButton />
      </PageNowPlaying>
    </PageContent>
  );
}

export default TripsPage;
