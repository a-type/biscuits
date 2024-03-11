import { TripMenu } from '@/components/trips/TripMenu.jsx';
import { TripView } from '@/components/trips/TripView.jsx';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { Link, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface TripPageProps {}

export function TripPage({}: TripPageProps) {
  const params = useParams();
  const tripId = params.tripId;
  return (
    <PageContent>
      <PageFixedArea className="py-2 flex flex-row justify-between">
        <Button asChild color="ghost">
          <Link to="/">
            <Icon name="arrowLeft" />
            Back to trips
          </Link>
        </Button>
        <TripMenu tripId={tripId} />
      </PageFixedArea>

      <Suspense>
        <TripView tripId={tripId} />
      </Suspense>
    </PageContent>
  );
}

export default TripPage;
