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
				className="[font-family:inherit] [font-size:inherit] [font-style:inherit] m-0 h-full w-full resize-none p-0 text-inherit outline-none bg-transparent !rounded-none !border-none focus:(outline-none bg-transparent border-transparent) !ring-none !ring-none !focus:shadow-none"
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
