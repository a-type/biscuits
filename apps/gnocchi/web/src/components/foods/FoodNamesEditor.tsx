import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	FormikForm,
	Icon,
	SubmitButton,
	TextField,
	toast,
} from '@a-type/ui';
import { RemovableTag } from '@biscuits/client';
import { FoodAlternateNames } from '@gnocchi.biscuits/verdant';
import { useState } from 'react';

export interface FoodNamesEditorProps {
	names: FoodAlternateNames;
}

export function FoodNamesEditor({ names }: FoodNamesEditorProps) {
	hooks.useWatch(names);
	const asArray = names.getAll();
	const unique = Array.from(new Set(asArray));

	return (
		<Box wrap items="center" gap="sm">
			{unique.map((name) => (
				<FoodNameTag
					key={name}
					name={name}
					onDelete={(name) => names.removeAll(name)}
				/>
			))}
			<AddNameButton names={names} />
		</Box>
	);
}

function FoodNameTag({
	name,
	onDelete,
}: {
	name: string;
	onDelete: (name: string) => void;
}) {
	return <RemovableTag name={name} onRemove={() => onDelete(name)} />;
}

function AddNameButton({ names }: { names: FoodAlternateNames }) {
	const client = hooks.useClient();
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Trigger render={<Button size="small" />}>
				<Icon name="plus" />
				<span>Add name</span>
			</Dialog.Trigger>
			<Dialog.Content>
				<FormikForm
					initialValues={{ name: '' }}
					onSubmit={async (values, bag) => {
						bag.setSubmitting(true);
						try {
							// cannot add a name that already exists elsewhere
							const lookup = await client.foods.findOne({
								index: {
									where: 'nameLookup',
									equals: values.name,
								},
							}).resolved;

							if (lookup) {
								toast.error(
									`This food name is already used by ${lookup.get(
										'canonicalName',
									)}. Food names can only be used once.`,
								);
								return;
							}
							if (values.name) {
								names.add(values.name.toLowerCase());
							}
							setOpen(false);
						} finally {
							bag.setSubmitting(false);
						}
					}}
				>
					<TextField name="name" label="Name" required />
					<DialogActions>
						<DialogClose />
						<SubmitButton>Add</SubmitButton>
					</DialogActions>
				</FormikForm>
			</Dialog.Content>
		</Dialog>
	);
}
