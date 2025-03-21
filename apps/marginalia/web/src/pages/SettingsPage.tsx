import { H1, PageContent } from '@a-type/ui';
import { DarkModeToggle } from '@biscuits/client';
import { UpdatePrompt, usePollForUpdates } from '@biscuits/client/apps';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	usePollForUpdates();

	return (
		<PageContent fullHeight noPadding>
			<div className="flex flex-col w-full mt-6 p-4 gap-4 items-start">
				<H1>Settings</H1>
				<UpdatePrompt />
				<div className="flex flex-col items-start w-full gap-4">
					<DarkModeToggle />
				</div>
			</div>
		</PageContent>
	);
}

export default SettingsPage;
