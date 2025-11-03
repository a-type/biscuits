import { Button, H1, Icon, PageContent, PageFixedArea } from '@a-type/ui';
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

	usePageTitle('Palette | Settings');

	return (
		<PageContent>
			<PageFixedArea className="row py-2">
				<Button asChild emphasis="ghost">
					<Link to="/">
						<Icon name="arrowLeft" /> Back
					</Link>
				</Button>
			</PageFixedArea>
			<H1>Settings</H1>
			<UpdatePrompt />
			<div className="flex flex-col items-start w-full gap-4">
				<DarkModeToggle />
				<ManageStorage />
			</div>
			<AutoRestoreScroll />
		</PageContent>
	);
}

export default SettingsPage;
