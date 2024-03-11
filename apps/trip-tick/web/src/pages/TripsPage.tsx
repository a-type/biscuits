import { AddTripButton } from '@/components/trips/AddTripButton.jsx';
import { TripsList } from '@/components/trips/TripsList.jsx';
import { PageContent, PageNowPlaying } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { UserMenu } from '@biscuits/client';

export interface TripsPageProps {}

export function TripsPage({}: TripsPageProps) {
  return (
    <PageContent>
      <div className="flex flex-row items-center justify-between mb-4">
        <H1>Trips</H1>
        <UserMenu className="ml-auto" />
      </div>
      <TripsList />
      <PageNowPlaying unstyled>
        <AddTripButton />
      </PageNowPlaying>
    </PageContent>
  );
}

export default TripsPage;
