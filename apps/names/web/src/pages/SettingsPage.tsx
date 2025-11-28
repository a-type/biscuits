import { LocationOffer } from '@/components/location/LocationOffer.jsx';
import { PageContent, PageRoot } from '@a-type/ui';
import { SettingsPageWrapper } from '@biscuits/client/apps';
import { AutoRestoreScroll } from '@verdant-web/react-router';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	return (
		<PageRoot>
			<PageContent>
				<SettingsPageWrapper>
					<LocationOffer overrideDeny emphasis="default" />
				</SettingsPageWrapper>
				<AutoRestoreScroll />
			</PageContent>
		</PageRoot>
	);
}

export default SettingsPage;
