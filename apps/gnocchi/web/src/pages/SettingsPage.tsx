import { useKeepOpenAfterSelect } from '@/components/groceries/addBar/hooks.js';
import { ManageCategoriesDialog } from '@/components/menu/ManageCategoriesDialog.jsx';
import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { Button, PageContent, Switch } from '@a-type/ui';
import { SettingsPageWrapper } from '@biscuits/client/apps';

export function SettingsPage() {
	return (
		<PageContent p="none">
			<SettingsPageWrapper installPitch="Always have your list on hand. Install the app!">
				<ManageCategories />
				<ManageSettings />
			</SettingsPageWrapper>
			<AutoRestoreScroll />
		</PageContent>
	);
}

export default SettingsPage;

function ManageCategories() {
	return (
		<div>
			<ManageCategoriesDialog>
				<Button>Manage categories</Button>
			</ManageCategoriesDialog>
			<span className="text-xs">Add, remove, and rearrange categories</span>
		</div>
	);
}

function ManageSettings() {
	const [addBarKeepOpen, setAddBarKeepOpen] = useKeepOpenAfterSelect();
	return (
		<div className="row">
			<Switch
				id="addbar-keepopen"
				checked={addBarKeepOpen}
				onCheckedChange={setAddBarKeepOpen}
			/>
			<label htmlFor="addbar-keepopen" className="text-sm">
				Keep add bar open after adding items
			</label>
		</div>
	);
}
