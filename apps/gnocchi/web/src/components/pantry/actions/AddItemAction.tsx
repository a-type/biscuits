import { hooks } from '@/stores/groceries/index.js';
import {
	ActionButton,
	Button,
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
	const addItem = hooks.useAddPantryItem();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<ActionButton icon={<PlusIcon />}>Add items</ActionButton>
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
						<DialogClose asChild>
							<Button>Done</Button>
						</DialogClose>
						<SubmitButton>Add</SubmitButton>
					</DialogActions>
				</FormikForm>
			</DialogContent>
		</Dialog>
	);
}
