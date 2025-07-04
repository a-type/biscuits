import { TripView } from '@/components/trips/TripView.jsx';
import { PageContent } from '@a-type/ui';
import { useTitleBarColor } from '@biscuits/client';
import { AutoRestoreScroll, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface TripPageProps {}

export function TripPage({}: TripPageProps) {
	const params = useParams();
	const tripId = params.tripId;
	useTitleBarColor('var(--color-primary-wash)');
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
