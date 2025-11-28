import { PageContent } from '@a-type/ui';
import { SettingsPageWrapper, usePollForUpdates } from '@biscuits/client/apps';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	usePollForUpdates();

	return (
		<PageContent p="none">
			<SettingsPageWrapper />
		</PageContent>
	);
}

export default SettingsPage;
