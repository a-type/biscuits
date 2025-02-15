import { UpdatePrompt } from '@/components/updatePrompt/UpdatePrompt.jsx';
import { checkForUpdate } from '@/updateState.js';
import { H1, PageContent } from '@a-type/ui';
import { DarkModeToggle } from '@biscuits/client';
import { useEffect } from 'react';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	useEffect(() => {
		checkForUpdate();
	}, []);

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
