import { TripView } from '@/components/trips/TripView.jsx';
import { PageContent, useThemedTitleBar } from '@a-type/ui';
import { useParams } from '@tanstack/react-router';
import { Suspense } from 'react';

export interface TripPageProps {}

export function TripPage({}: TripPageProps) {
	const { tripId } = useParams({ from: '/trips/$tripId' });
	useThemedTitleBar('--m-tint-wash');
	return (
		<PageContent className="initial">
			<Suspense>
				<TripView tripId={tripId} />
			</Suspense>
		</PageContent>
	);
}

export default TripPage;
