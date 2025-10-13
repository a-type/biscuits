import { useKeepOpenAfterSelect } from '@/components/groceries/addBar/hooks.js';
import { ManageCategoriesDialog } from '@/components/menu/ManageCategoriesDialog.jsx';
import { Button, Field, PageContent, Switch, Text } from '@a-type/ui';
import { SettingsPageWrapper } from '@biscuits/client/apps';

export function SettingsPage() {
	return (
		<PageContent p="none">
			<SettingsPageWrapper installPitch="Always have your list on hand. Install the app!">
				<ManageCategories />
				<ManageSettings />
			</SettingsPageWrapper>
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
			<Text emphasis="ambient">Add, remove, and rearrange categories</Text>
		</div>
	);
}

function ManageSettings() {
	const [addBarKeepOpen, setAddBarKeepOpen] = useKeepOpenAfterSelect();
	return (
		<Field horizontal>
			<Field.Control>
				<Switch
					id="addbar-keepopen"
					checked={addBarKeepOpen}
					onCheckedChange={setAddBarKeepOpen}
				/>
			</Field.Control>
			<Field.Label htmlFor="addbar-keepopen">
				Keep add bar open after adding items
			</Field.Label>
		</Field>
	);
}
