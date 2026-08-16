import { PageContent } from '@a-type/ui';
import { SettingsPageWrapper } from '@biscuits/client/apps';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
	component: SettingsPage,
});

function SettingsPage() {
	return (
		<PageContent p="none">
			<SettingsPageWrapper />
		</PageContent>
	);
}
