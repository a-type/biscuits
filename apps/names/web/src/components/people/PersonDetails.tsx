import { hooks } from '@/hooks.js';
import {
	Button,
	clsx,
	EditableText,
	Icon,
	LiveUpdateTextField,
	Note,
} from '@a-type/ui';
import { Person } from '@names.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import { useState } from 'react';

export interface PersonDetailsProps {
	person: Person;
}

export function PersonDetails({ person }: PersonDetailsProps) {
	const { name } = hooks.useWatch(person);

	return (
		<div className="col items-start w-full">
			<div className="row gap-0">
				<Button color="ghost" size="icon" asChild>
					<Link to="/">
						<Icon name="arrowLeft" />
					</Link>
				</Button>
				<EditableText
					value={name}
					onValueChange={(value) => person.set('name', value)}
					className="text-xl"
				/>
			</div>
			<NoteEditor person={person} />
		</div>
	);
}

function NoteEditor({
	person,
	className,
}: {
	person: Person;
	className?: string;
}) {
	const { note } = hooks.useWatch(person);
	const [open, setOpen] = useState(false);

	if (!note && !open) {
		return (
			<Button size="small" onClick={() => setOpen(true)}>
				<Icon name="add_note" /> Add a note
			</Button>
		);
	}

	return (
		<Note className={clsx('focus-within:shadow-focus', className)}>
			<LiveUpdateTextField
				className="!border-none outline-none resize-none w-full !rounded-none !shadow-none h-full p-0 m-0 [font-family:inherit] text-inherit [font-size:inherit] [font-style:inherit] bg-transparent shadow-none focus:(outline-none bg-transparent border-transparent shadow-none)"
				textArea
				value={note || ''}
				onChange={(value) => person.set('note', value)}
				onBlur={() => setOpen(false)}
				placeholder="Add a note..."
				autoFocus={open}
			/>
		</Note>
	);
}
