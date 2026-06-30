import { hooks } from '@/stores/groceries/index.js';
import { useDeleteList } from '@/stores/groceries/mutations.js';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
	H2,
	Icon,
	LiveUpdateTextField,
} from '@a-type/ui';
import { ColorPicker } from '@biscuits/client';
import { useState } from 'react';

export interface ListEditProps {
	listId: string;
}

export function ListEdit({ listId }: ListEditProps) {
	const list = hooks.useList(listId);
	hooks.useWatch(list);
	const deleteList = useDeleteList();

	const [open, setOpen] = useState(false);

	if (!list) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button emphasis="ghost" size="small" />}>
				<Icon name="gear" />
			</DialogTrigger>
			<DialogContent>
				<Box col items="start" gap="sm">
					<H2>Edit List</H2>
					<Box gap="sm">
						<LiveUpdateTextField
							value={list.get('name')}
							onChange={(name) => list.set('name', name)}
							required
						/>
						<ColorPicker
							value={list.get('color')}
							onValueChange={(color) => color && list.set('color', color)}
						/>
					</Box>
					<Button
						emphasis="primary"
						color="attention"
						onClick={async () => {
							await deleteList(list.get('id'));
							setOpen(false);
						}}
					>
						Delete List
					</Button>
					<DialogActions>
						<DialogClose render={<Button emphasis="primary" />}>
							Done
						</DialogClose>
					</DialogActions>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
