import { LiveUpdateTextField, Note } from '@a-type/ui';
import classNames from 'classnames';

export interface NoteEditorProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
	autoFocus?: boolean;
	onBlur?: () => void;
}

export function NoteEditor({
	className,
	autoFocus,
	value,
	onChange,
	onBlur,
}: NoteEditorProps) {
	const handleChange = (v: string) => {
		onChange(v.trim());
	};
	return (
		<Note className={classNames('focus-within:shadow-focus', className)}>
			<LiveUpdateTextField
				className="[font-family:inherit] [font-size:inherit] [font-style:inherit] m-0 h-full w-full resize-none p-0 text-inherit outline-none bg-transparent !rounded-none !border-none focus:(outline-none bg-transparent border-transparent) !ring-none !ring-none !focus:shadow-none"
				textArea
				value={value}
				onChange={handleChange}
				autoFocus={autoFocus}
				onBlur={onBlur}
				placeholder="Add a note..."
			/>
		</Note>
	);
}
