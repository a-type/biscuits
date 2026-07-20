import { PageContent } from '@a-type/ui';
import { SettingsPageWrapper } from '@biscuits/client/apps';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	return (
		<PageContent p="none">
			<SettingsPageWrapper />
		</PageContent>
	);
}

export default SettingsPage;
