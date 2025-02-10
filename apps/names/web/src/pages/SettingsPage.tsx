import { LocationOffer } from '@/components/location/LocationOffer.jsx';
import { checkForUpdate } from '@/updateState.js';
import {
	Button,
	H1,
	Icon,
	PageContent,
	PageFixedArea,
	PageRoot,
} from '@a-type/ui';
import { DarkModeToggle } from '@biscuits/client';
import { ManageStorage } from '@biscuits/client/storage';
import { AutoRestoreScroll, Link } from '@verdant-web/react-router';
import { useEffect } from 'react';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	useEffect(() => {
		checkForUpdate();
	}, []);

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
