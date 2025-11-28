import { PageContent } from '@a-type/ui';
import { SettingsPageWrapper } from '@biscuits/client/apps';
import { AutoRestoreScroll } from '@verdant-web/react-router';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	return (
		<PageContent>
			<SettingsPageWrapper />
			<AutoRestoreScroll />
		</PageContent>
	);
}

export default SettingsPage;
