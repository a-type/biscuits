import { hooks } from '@/hooks.js';
import { Button, Icon, Note } from '@a-type/ui';
import { ListItemsItem } from '@wish-wash.biscuits/verdant';
import { useState } from 'react';

export interface ItemNoteProps {
	item: ListItemsItem;
}

export function ItemNote({ item }: ItemNoteProps) {
	const { note } = hooks.useWatch(item);
	const [show, setShow] = useState(false);

	if (!note && !show) {
		return (
			<Button emphasis="ghost" size="small" onClick={() => setShow(true)}>
				<Icon name="add_note" />
				Add note
			</Button>
		);
	}

	return (
		<Note>
			<Note.Input
				placeholder="Add a note..."
				autoFocus={show}
				value={note || ''}
				onValueChange={(note) => item.set('note', note)}
				onBlur={() => setShow(false)}
			/>
		</Note>
	);
}
