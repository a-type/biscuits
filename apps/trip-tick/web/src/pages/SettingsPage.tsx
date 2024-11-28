import { TemperatureUnitSelect } from '@/components/weather/TemperatureUnit.jsx';
import {
	Button,
	H1,
	Icon,
	PageContent,
	PageFixedArea,
	toast,
} from '@a-type/ui';
import { DarkModeToggle, usePageTitle } from '@biscuits/client';
import { ManageStorage } from '@biscuits/client/storage';
import { AutoRestoreScroll, Link } from '@verdant-web/react-router';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
	usePageTitle('Settings');
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
			<div className="flex flex-col gap-4 my-6 mx-2 items-start">
				<DarkModeToggle />
				<TemperatureUnitSelect />
				<ManageStorage onError={(er) => toast.error(er.message)} />
			</div>
			<AutoRestoreScroll />
		</PageContent>
	);
}

export default SettingsPage;
