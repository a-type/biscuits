import { ListsList } from '@/components/lists/ListsList.jsx';
import { AddTripButton } from '@/components/trips/AddTripButton.jsx';
import { TripsList } from '@/components/trips/TripsList.jsx';
import {
	Box,
	Divider,
	Heading,
	Icon,
	PageContent,
	PageNowPlaying,
} from '@a-type/ui';
import { InfrequentSubscriptionHint, usePageTitle } from '@biscuits/client';
import { AppIcon, InstallHint, UserMenu } from '@biscuits/client/apps';
import { AutoRestoreScroll } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface TripsPageProps {}

export function TripsPage({}: TripsPageProps) {
	usePageTitle('Trips');
	return (
		<PageContent>
			<Box col items="stretch" gap="xl">
				<Box layout="center between">
					<Box items="center" gap="sm">
						<AppIcon size={32} />
						<Heading bold emphasis="ambient" className="font-fancy">
							Trip Tick
						</Heading>
					</Box>
					<Suspense>
						<UserMenu />
					</Suspense>
				</Box>
				<Suspense>
					<ListsList />
				</Suspense>
				<Suspense>
					<Divider />
					<TripsList />
				</Suspense>
				<InstallHint content="Keep your packing lists handy. Install the app!" />
				<InfrequentSubscriptionHint />
			</Box>
			<AutoRestoreScroll />
			<PageNowPlaying>
				<Box col items="center" p>
					<AddTripButton>
						<Icon name="plus" /> New Trip
					</AddTripButton>
				</Box>
			</PageNowPlaying>
		</PageContent>
	);
}

export default TripsPage;
