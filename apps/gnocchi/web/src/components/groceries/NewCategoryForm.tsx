import { hooks } from '@/stores/groceries/index.js';
import { FormikForm, SubmitButton, TextField } from '@a-type/ui';
import { Category } from '@gnocchi.biscuits/verdant';

export function NewCategoryForm({
	onDone,
	autoFocus,
}: {
	onDone: (category: Category) => void;
	autoFocus?: boolean;
}) {
	const createCategory = hooks.useCreateCategory();
	return (
		<div className="flex flex-col gap-2 items-stretch w-full">
			<FormikForm
				initialValues={{ name: '' }}
				onSubmit={async ({ name }) => {
					// create the category
					const category = await createCategory(name);
					onDone(category);
				}}
				className="w-full"
			>
				<div className="flex flex-row items-end justify-stretch w-full gap-2">
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
