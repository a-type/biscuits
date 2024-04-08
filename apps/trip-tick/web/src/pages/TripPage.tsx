import { TripView } from '@/components/trips/TripView.jsx';
import { PageContent } from '@a-type/ui/components/layouts';
import { useTitleBarColor } from '@biscuits/client';
import { AutoRestoreScroll, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface TripPageProps {}

export function TripPage({}: TripPageProps) {
  const params = useParams();
  const tripId = params.tripId;
  useTitleBarColor('#f1efff');
  return (
    <PageContent fullHeight className="initial">
      <Suspense>
        <TripView tripId={tripId} />
      </Suspense>
      <AutoRestoreScroll />
    </PageContent>
  );
}

export default TripPage;
