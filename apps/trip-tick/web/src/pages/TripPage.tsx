import { TripView } from '@/components/trips/TripView.jsx';
import { PageContent, useThemedTitleBar } from '@a-type/ui';
import { AutoRestoreScroll, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface TripPageProps {}

export function TripPage({}: TripPageProps) {
	const params = useParams();
	const tripId = params.tripId;
	useThemedTitleBar('primary', 'wash');
	return (
		<PageContent className="initial">
			<Suspense>
				<TripView tripId={tripId} />
			</Suspense>
			<AutoRestoreScroll />
		</PageContent>
	);
}

export default TripPage;
