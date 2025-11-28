import { TemperatureUnitSelect } from '@/components/weather/TemperatureUnit.jsx';
import { PageContent } from '@a-type/ui';
import { SettingsPageWrapper } from '@biscuits/client/apps';
import { AutoRestoreScroll } from '@verdant-web/react-router';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	return (
		<PageContent p="none">
			<SettingsPageWrapper>
				<TemperatureUnitSelect />
			</SettingsPageWrapper>
			<AutoRestoreScroll />
		</PageContent>
	);
}

export default SettingsPage;
