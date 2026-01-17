import { hooks } from '@/stores/groceries/index.js';
import {
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
		<div className="flex flex-row flex-wrap items-center gap-2">
			{unique.map((name) => (
				<FoodNameTag
					key={name}
					name={name}
					onDelete={(name) => names.removeAll(name)}
				/>
			))}
			<AddNameButton names={names} />
		</div>
	);
}

function FoodNameTag({
	name,
	onDelete,
}: {
	name: string;
	onDelete: (name: string) => void;
}) {
	return (
		<div className="max-w-full inline-flex flex-row items-center gap-1 overflow-hidden whitespace-nowrap border rounded-2xl border-solid px-3 py-1 text-sm border-black">
			<span className="overflow-hidden text-ellipsis">{name}</span>
			<Button
				onClick={() => onDelete(name)}
				emphasis="ghost"
				className="important:p-2px"
			>
				<Icon name="x" />
			</Button>
		</div>
	);
}

function AddNameButton({ names }: { names: FoodAlternateNames }) {
	const client = hooks.useClient();
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Trigger
				render={
					<Button
						size="small"
						className="important:rounded-2xl important:px-3 important:py-1"
					/>
				}
			>
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
