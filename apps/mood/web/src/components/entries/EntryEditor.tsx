import { hooks } from '@/hooks.js';
import { Box } from '@a-type/ui';
import { Entry } from '@mood.biscuits/verdant';
import { MoodPicker } from './MoodPicker.jsx';
import { TagsEditor } from './TagsEditor.jsx';

export interface EntryEditorProps {
	entry: Entry;
	className?: string;
}

export function EntryEditor({ entry, className }: EntryEditorProps) {
	const { value, tags } = hooks.useWatch(entry);

	if (value === null) {
		return (
			<MoodPicker
				value={value}
				onValueChange={(val) => entry.set('value', val)}
			/>
		);
	}

	return (
		<Box col className={className} gap="sm">
			<MoodPicker
				row
				value={value}
				onValueChange={(val) => entry.set('value', val)}
			/>
			<TagsEditor tags={tags} />
		</Box>
	);
}
