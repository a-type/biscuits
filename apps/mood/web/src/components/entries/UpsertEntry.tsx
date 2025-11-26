import { hooks } from '@/hooks.js';
import { verdant } from '@/store.js';
import { startOfDay } from 'date-fns';
import { useEffect } from 'react';
import { EntryEditor } from './EntryEditor.jsx';

export interface UpsertEntryProps {
	className?: string;
	date: Date;
}

export function UpsertEntry({ className, date }: UpsertEntryProps) {
	const start = startOfDay(date);
	const entry = hooks.useOneEntry({
		index: {
			where: 'date',
			equals: start.getTime(),
		},
	});

	const exists = !!entry;
	useEffect(() => {
		if (!exists) {
			verdant.entries.put({
				createdAt: start.getTime(),
			});
		}
	}, [exists, start]);

	if (!entry) {
		return null;
	}

	return <EntryEditor entry={entry} className={className} />;
}
