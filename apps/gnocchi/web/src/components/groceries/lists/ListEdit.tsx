import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	ColorPicker,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
	H2,
	LiveUpdateTextField,
	PaletteName,
} from '@a-type/ui';
import { GearIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

export interface ListEditProps {
	listId: string;
}

export function ListEdit({ listId }: ListEditProps) {
	const list = hooks.useList(listId);
	hooks.useWatch(list);
	const deleteList = hooks.useDeleteList();

	const [open, setOpen] = useState(false);

	if (!list) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button emphasis="ghost" size="small">
					<GearIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<div className="flex flex-col gap-2 items-start">
					<H2>Edit List</H2>
					<div className="flex flex-row gap-2">
						<LiveUpdateTextField
							value={list.get('name')}
							onChange={(name) => list.set('name', name)}
							required
						/>
						<ColorPicker
							value={list.get('color') as PaletteName}
							onChange={(color) => list.set('color', color)}
						/>
					</div>
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
						<DialogClose asChild>
							<Button emphasis="primary">Done</Button>
						</DialogClose>
					</DialogActions>
				</div>
			</DialogContent>
		</Dialog>
	);
}
