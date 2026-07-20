import { TemperatureUnitSelect } from '@/components/weather/TemperatureUnit.jsx';
import { PageContent } from '@a-type/ui';
import { SettingsPageWrapper } from '@biscuits/client/apps';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	return (
		<PageContent p="none">
			<SettingsPageWrapper>
				<TemperatureUnitSelect />
			</SettingsPageWrapper>
		</PageContent>
	);
}

export default SettingsPage;
