import { hooks } from '@/hooks.js';
import { Button, Icon, LiveUpdateTextField, Note } from '@a-type/ui';
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
			<LiveUpdateTextField
				className="!border-none outline-none resize-none w-full !rounded-none !ring-none h-full p-0 m-0 [font-family:inherit] text-inherit [font-size:inherit] [font-style:inherit] bg-transparent !ring-none focus:(outline-none bg-transparent border-transparent !shadow-none)"
				placeholder="Add a note..."
				autoFocus={show}
				textArea
				value={note || ''}
				onChange={(note) => item.set('note', note)}
				onBlur={() => setShow(false)}
			/>
		</Note>
	);
}
