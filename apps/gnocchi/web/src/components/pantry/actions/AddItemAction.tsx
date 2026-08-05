import { useAddPantryItem } from '@/stores/groceries/mutations.js';
import {
	ActionButton,
	Dialog,
	FormikForm,
	Icon,
	SubmitButton,
	TextField,
} from '@a-type/ui';

export function AddItemAction() {
	const addItem = useAddPantryItem();

	return (
		<Dialog>
			<Dialog.Trigger render={<ActionButton />}>
				<Icon name="plus" />
				Add items
			</Dialog.Trigger>
			<Dialog.Content>
				<FormikForm
					initialValues={{ name: '' }}
					onSubmit={async (values, bag) => {
						await addItem(values.name);
						bag.resetForm();
					}}
				>
					<TextField name="name" label="Name" placeholder="garlic" />
					<Dialog.Actions>
						<Dialog.Close>Done</Dialog.Close>
						<SubmitButton>Add</SubmitButton>
					</Dialog.Actions>
				</FormikForm>
			</Dialog.Content>
		</Dialog>
	);
}
