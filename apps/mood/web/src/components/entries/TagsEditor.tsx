import { hooks } from '@/hooks.js';
import { Box, Button } from '@a-type/ui';
import { EntryTags } from '@mood.biscuits/verdant';

export interface TagsEditorProps {
	tags: EntryTags;
}

export function TagsEditor({ tags }: TagsEditorProps) {
	const allTags = hooks.useAllTags({
		index: {
			where: 'useCount',
			order: 'desc',
		},
	});
	hooks.useWatch(tags);

	return (
		<Box wrap gap>
			{allTags.map((tag) => (
				<Button
					key={tag.uid}
					onClick={() => {
						if (tags.has(tag.get('value'))) {
							tags.removeAll(tag.get('value'));
						} else {
							tags.add(tag.get('value'));
						}
					}}
					toggled={tags.has(tag.get('value'))}
				>
					{tag.get('value')}
				</Button>
			))}
		</Box>
	);
}
