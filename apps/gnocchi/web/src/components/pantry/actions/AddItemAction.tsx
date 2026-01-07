import { useAddPantryItem } from '@/stores/groceries/mutations.js';
import {
	ActionButton,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
	FormikForm,
	Icon,
	SubmitButton,
	TextField,
} from '@a-type/ui';

export function AddItemAction() {
	const addItem = useAddPantryItem();

	return (
		<Dialog>
			<DialogTrigger render={<ActionButton />}>
				<Icon name="plus" />
				Add items
			</DialogTrigger>
			<DialogContent>
				<FormikForm
					initialValues={{ name: '' }}
					onSubmit={async (values, bag) => {
						await addItem(values.name);
						bag.resetForm();
					}}
				>
					<TextField name="name" label="Name" placeholder="garlic" />
					<DialogActions>
						<DialogClose>Done</DialogClose>
						<SubmitButton>Add</SubmitButton>
					</DialogActions>
				</FormikForm>
			</DialogContent>
		</Dialog>
	);
}
