import { hooks } from '@/hooks.js';
import { Box, clsx } from '@a-type/ui';
import { Entry } from '@mood.biscuits/verdant';
import { Suspense } from 'react';
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
				className={clsx(
					'w-full transition-height duration-300',
					value === null ? 'h-100dvh' : 'h-50dvh',
				)}
				value={value}
				onValueChange={(val) => entry.set('value', val)}
			/>
			<Box
				col
				className="max-w-lg w-full pb-xl pt-md b-t-solid b-t-2 b-t-main-ink"
			>
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
