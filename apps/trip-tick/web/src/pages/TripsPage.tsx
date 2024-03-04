import {
  NavigationTab,
  NavigationTabsRoot,
} from '@/components/nav/NavigationTabs.jsx';
import { RouteDialog } from '@/components/nav/RouteDialog.jsx';
import { AddTripButton } from '@/components/trips/AddTripButton.jsx';
import { TripsList } from '@/components/trips/TripsList.jsx';
import {
  PageContent,
  PageFixedArea,
  PageNowPlaying,
} from '@a-type/ui/components/layouts';
import { TabsList } from '@a-type/ui/components/tabs';

export interface TripsPageProps {}

export function TripsPage({}: TripsPageProps) {
  return (
    <PageContent>
      <TripsList />
      <PageNowPlaying unstyled>
        <AddTripButton />
      </PageNowPlaying>
      <RouteDialog />
    </PageContent>
  );
}

export default TripsPage;
