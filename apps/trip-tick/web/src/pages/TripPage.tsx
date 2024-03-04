import { TripView } from '@/components/trips/TripView.jsx';
import { Button } from '@a-type/ui/components/button';
import { DialogActions, DialogClose } from '@a-type/ui/components/dialog';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { Link, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface TripPageProps {}

export function TripPage({}: TripPageProps) {
  const params = useParams();
  const tripId = params.tripId;
  return (
    <>
      <div className="flex-1">
        <Suspense>
          <TripView tripId={tripId} />
        </Suspense>
      </div>
      <DialogActions>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogActions>
    </>
  );
}

export default TripPage;
