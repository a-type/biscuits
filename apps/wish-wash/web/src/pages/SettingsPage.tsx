import { PageContent, PageRoot } from '@a-type/ui';
import { SettingsPageWrapper } from '@biscuits/client/apps';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	return (
		<PageRoot>
			<PageContent p="none">
				<SettingsPageWrapper />
			</PageContent>
		</PageRoot>
	);
}

export default SettingsPage;
