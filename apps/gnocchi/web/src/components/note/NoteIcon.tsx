import { Icon } from '@a-type/ui';
import cls from './NoteIcon.module.css';

export interface NoteIconProps {
	open?: boolean;
	hasNote?: boolean;
}

export function NoteIcon({ open, hasNote }: NoteIconProps) {
	if (!hasNote) {
		return <Icon name="add_note" className={cls.add} />;
	}

	return <Icon name="note" className={open ? undefined : cls.open} />;
}
