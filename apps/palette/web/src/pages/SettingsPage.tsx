import { useEffect } from 'react';
import { checkForUpdate } from '@/updateState.js';
import { H1 } from '@a-type/ui/components/typography';
import { DarkModeToggle, usePageTitle } from '@biscuits/client';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { ManageStorage } from '@biscuits/client/storage';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { AutoRestoreScroll, Link } from '@verdant-web/react-router';

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
			<div className="flex flex-col items-start w-full gap-4">
				<DarkModeToggle />
				<ManageStorage />
			</div>
			<AutoRestoreScroll />
		</PageContent>
	);
}

export default SettingsPage;
