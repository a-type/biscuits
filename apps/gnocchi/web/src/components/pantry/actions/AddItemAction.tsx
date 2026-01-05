import { useAddPantryItem } from '@/stores/groceries/mutations.js';
import {
	ActionButton,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
	FormikForm,
	SubmitButton,
	TextField,
} from '@a-type/ui';
import { PlusIcon } from '@radix-ui/react-icons';

export function AddItemAction() {
	const addItem = useAddPantryItem();

	return (
		<Dialog>
			<DialogTrigger render={<ActionButton />}>
				<PlusIcon />
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
