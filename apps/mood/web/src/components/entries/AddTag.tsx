import { hooks } from '@/hooks.js';
import { Box, Button, Dialog, FormikForm, Icon } from '@a-type/ui';
import { Tag } from '@mood.biscuits/verdant';
import { useState } from 'react';

export interface AddTagProps {
	className?: string;
	onAdd?: (tag: Tag) => void;
}

export function AddTag({ className, onAdd }: AddTagProps) {
	const client = hooks.useClient();

	const [open, setOpen] = useState(false);

	async function handleAdd(name: string) {
		const tag = await client.tags.put({ value: name });
		if (onAdd) {
			onAdd(tag);
		}
		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Content>
				<Dialog.Title>New tag</Dialog.Title>
				<FormikForm
					initialValues={{ value: '', emoji: '' }}
					onSubmit={({ value, emoji }, tools) => {
						handleAdd(emoji ? `${emoji} ${value}` : value);
						tools.resetForm();
					}}
				>
					<Box gap items="end">
						<FormikForm.EmojiField name="emoji" className="mb-1px" />
						<FormikForm.TextField autoFocus name="value" label="Tag Name" />
					</Box>
					<Dialog.Actions className="justify-between">
						<Dialog.Close />
						<FormikForm.SubmitButton>
							<Icon name="check" />
							Add
						</FormikForm.SubmitButton>
					</Dialog.Actions>
				</FormikForm>
			</Dialog.Content>{' '}
			<Dialog.Trigger asChild className={className}>
				<Button size="small" onClick={() => setOpen(true)}>
					<Icon name="plus" /> New Tag
				</Button>
			</Dialog.Trigger>
		</Dialog>
	);
}
