import { useCreateCategory } from '@/stores/groceries/mutations.js';
import { Box, FormikForm, SubmitButton, TextField } from '@a-type/ui';
import { Category } from '@gnocchi.biscuits/verdant';

export function NewCategoryForm({
	onDone,
	autoFocus,
}: {
	onDone: (category: Category) => void;
	autoFocus?: boolean;
}) {
	const createCategory = useCreateCategory();
	return (
		<Box full="width" col items="stretch" gap="sm">
			<FormikForm
				initialValues={{ name: '' }}
				onSubmit={async ({ name }) => {
					// create the category
					const category = await createCategory(name);
					onDone(category);
				}}
				className="w-full"
			>
				<Box full="width" items="end" justify="stretch" gap="sm">
					<TextField
						placeholder="Dairy & Eggs"
						autoFocusDelay={autoFocus ? 100 : undefined}
						name="name"
						style={{ flex: 1 }}
						autoComplete="off"
					/>
					<SubmitButton>Add</SubmitButton>
				</Box>
			</FormikForm>
		</Box>
	);
}
