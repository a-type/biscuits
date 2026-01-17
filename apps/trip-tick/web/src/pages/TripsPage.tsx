import { Logo } from '@/components/brand/Logo.jsx';
import { ListsList } from '@/components/lists/ListsList.jsx';
import { AddTripButton } from '@/components/trips/AddTripButton.jsx';
import { TripsList } from '@/components/trips/TripsList.jsx';
import { Divider, Icon, PageContent, PageNowPlaying } from '@a-type/ui';
import { InfrequentSubscriptionHint, usePageTitle } from '@biscuits/client';
import { InstallHint, UserMenu } from '@biscuits/client/apps';
import { AutoRestoreScroll } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface TripsPageProps {}

export function TripsPage({}: TripsPageProps) {
	usePageTitle('Trips');
	return (
		<PageContent>
			<div className="col items-stretch !gap-10">
				<div className="mb-4 flex flex-row items-center justify-between">
					<div className="row">
						<Logo />
						<h1 className="[font-family:'Henrietta','Noto_Serif',serif] text-md font-semibold">
							Trip Tick
						</h1>
					</div>
					<Suspense>
						<UserMenu className="ml-auto" />
					</Suspense>
				</div>
				<Suspense>
					<ListsList />
				</Suspense>
				<Suspense>
					<Divider />
					<TripsList />
				</Suspense>
				<InstallHint
					content="Keep your packing lists handy. Install the app!"
					className="mt-4"
				/>
				<InfrequentSubscriptionHint />
			</div>
			<AutoRestoreScroll />
			<PageNowPlaying unstyled className="col items-center">
				<AddTripButton className="shadow-lg">
					<Icon name="plus" /> New Trip
				</AddTripButton>
			</PageNowPlaying>
		</PageContent>
	);
}

export default TripsPage;
