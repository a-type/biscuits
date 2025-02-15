import { UpdatePrompt } from '@/components/updatePrompt/UpdatePrompt.jsx';
import { checkForUpdate } from '@/updateState.js';
import { Button, H1, Icon, PageContent, PageFixedArea } from '@a-type/ui';
import { DarkModeToggle, usePageTitle } from '@biscuits/client';
import { ManageStorage } from '@biscuits/client/storage';
import { AutoRestoreScroll, Link } from '@verdant-web/react-router';
import { useEffect } from 'react';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	useEffect(() => {
		checkForUpdate();
	}, []);

	usePageTitle('Palette | Settings');

	return (
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
				<ManageStorage />
			</div>
			<AutoRestoreScroll />
		</PageContent>
	);
}

export default SettingsPage;
