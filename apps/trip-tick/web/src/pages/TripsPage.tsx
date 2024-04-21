import { AddTripButton } from '@/components/trips/AddTripButton.jsx';
import { TripsList } from '@/components/trips/TripsList.jsx';
import { PageContent, PageNowPlaying } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import {
  InfrequentSubscriptionHint,
  InstallHint,
  UserMenu,
  usePageTitle,
} from '@biscuits/client';
import { AutoRestoreScroll } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface TripsPageProps {}

export function TripsPage({}: TripsPageProps) {
  usePageTitle('Trips');
  return (
    <PageContent>
      <div className="flex flex-row items-center justify-between mb-4">
        <H1>Trips</H1>
        <Suspense>
          <UserMenu className="ml-auto" />
        </Suspense>
      </div>
      <TripsList />
      <InstallHint
        content="Keep your packing lists handy. Install the app!"
        className="mt-4"
      />
      <InfrequentSubscriptionHint />
      <PageNowPlaying unstyled>
        <AddTripButton />
      </PageNowPlaying>
      <AutoRestoreScroll />
    </PageContent>
  );
}

export default TripsPage;
