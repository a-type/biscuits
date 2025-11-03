import { Button, H1, Icon, PageContent, PageRoot } from '@a-type/ui';
import { DarkModeToggle } from '@biscuits/client';
import {
	ManageStorage,
	UpdatePrompt,
	usePollForUpdates,
} from '@biscuits/client/apps';
import { Link } from '@verdant-web/react-router';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	usePollForUpdates();

	return (
		<PageRoot>
			<PageContent p="none">
				<div className="flex flex-col w-full mt-6 p-4 gap-4 items-start">
					<Button asChild emphasis="ghost">
						<Link to="/">
							<Icon name="arrowLeft" />
							Back
						</Link>
					</Button>
					<H1>Settings</H1>
					<UpdatePrompt />
					<div className="flex flex-col items-start w-full gap-4">
						<DarkModeToggle />
						<ManageStorage />
					</div>
				</div>
			</PageContent>
		</PageRoot>
	);
}

export default SettingsPage;
