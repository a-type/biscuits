import { Note } from '@a-type/ui';
import { CSSProperties } from 'react';

export interface NoteEditorProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
	style?: CSSProperties;
	autoFocus?: boolean;
	onBlur?: () => void;
}

export function NoteEditor({
	className,
	autoFocus,
	value,
	onChange,
	onBlur,
	style,
}: NoteEditorProps) {
	const handleChange = (v: string) => {
		onChange(v);
	};
	return (
		<Note className={className} style={style}>
			<Note.Input
				value={value}
				onValueChange={handleChange}
				autoFocus={autoFocus}
				onBlur={onBlur}
				placeholder="Add a note..."
			/>
		</Note>
	);
}
