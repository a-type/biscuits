import { hooks } from '@/hooks.js';
import { verdant } from '@/store.js';
import { startOfDay } from 'date-fns';
import { useEffect } from 'react';
import { EntryEditor } from './EntryEditor.jsx';

export interface NewEntryProps {
	className?: string;
}

export function NewEntry({ className }: NewEntryProps) {
	const today = startOfDay(new Date());
	const entry = hooks.useOneEntry({
		index: {
			where: 'date',
			equals: today.getTime(),
		},
	});

	const exists = !!entry;
	useEffect(() => {
		if (!exists) {
			verdant.entries.put({});
		}
	}, [exists]);

	if (!entry) {
		return null;
	}

	return <EntryEditor entry={entry} className={className} />;
}
