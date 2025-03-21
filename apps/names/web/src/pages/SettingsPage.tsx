import { LocationOffer } from '@/components/location/LocationOffer.jsx';
import {
	Button,
	H1,
	Icon,
	PageContent,
	PageFixedArea,
	PageRoot,
} from '@a-type/ui';
import { DarkModeToggle, usePageTitle } from '@biscuits/client';
import {
	ManageStorage,
	UpdatePrompt,
	usePollForUpdates,
} from '@biscuits/client/apps';
import { AutoRestoreScroll, Link } from '@verdant-web/react-router';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	usePollForUpdates();
	usePageTitle('Settings');

	return (
		<PageRoot>
			<PageContent>
				<PageFixedArea className="row py-2">
					<Button asChild color="ghost">
						<Link to="/">
							<Icon name="arrowLeft" /> Back
						</Link>
					</Button>
				</PageFixedArea>
				<H1>Settings</H1>
				<UpdatePrompt />
				<div className="flex flex-col items-start w-full gap-4">
					<DarkModeToggle />
					<LocationOffer overrideDeny color="default" />
					<ManageStorage />
				</div>
				<AutoRestoreScroll />
			</PageContent>
		</PageRoot>
	);
}

export default SettingsPage;
