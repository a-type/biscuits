import { hooks } from '@/hooks.js';
import { Box } from '@a-type/ui';
import { Entry } from '@mood.biscuits/verdant';
import { Suspense } from 'react';
import cls from './EntryEditor.module.css';
import { MetadataDisplay } from './MetadataDisplay.jsx';
import { MoodPicker } from './MoodPicker.jsx';
import { TagsEditor } from './TagsEditor.jsx';

export interface EntryEditorProps {
	entry: Entry;
	className?: string;
}

export function EntryEditor({ entry, className }: EntryEditorProps) {
	const { value, tags } = hooks.useWatch(entry);

	return (
		<Box col className={className} items="center">
			<MoodPicker
				className={cls.picker}
				data-has-value={value !== null}
				value={value}
				onValueChange={(val) => entry.set('value', val)}
			/>
			<Box col className={cls.metadata}>
				<Suspense>
					<MetadataDisplay entry={entry} />
				</Suspense>
				<Suspense>
					<TagsEditor tags={tags} />
				</Suspense>
			</Box>
		</Box>
	);
}
