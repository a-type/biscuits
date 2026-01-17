import { useCreateCategory } from '@/stores/groceries/mutations.js';
import { FormikForm, SubmitButton, TextField } from '@a-type/ui';
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
		<div className="w-full flex flex-col items-stretch gap-2">
			<FormikForm
				initialValues={{ name: '' }}
				onSubmit={async ({ name }) => {
					// create the category
					const category = await createCategory(name);
					onDone(category);
				}}
				className="w-full"
			>
				<div className="w-full flex flex-row items-end justify-stretch gap-2">
					<TextField
						placeholder="Dairy & Eggs"
						autoFocusDelay={autoFocus ? 100 : undefined}
						name="name"
						className="flex-1"
						autoComplete="off"
					/>
					<SubmitButton>Add</SubmitButton>
				</div>
			</FormikForm>
		</div>
	);
}
