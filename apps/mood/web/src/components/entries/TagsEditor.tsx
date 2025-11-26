import { hooks } from '@/hooks.js';
import { Box, Button, PaletteName, paletteNames } from '@a-type/ui';
import { EntryTags } from '@mood.biscuits/verdant';
import { AddTag } from './AddTag.jsx';

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
		<Box wrap gap p items="center">
			{allTags.map((tag) => {
				const color = tag.get('color');
				const showColor =
					paletteNames.includes(color as any) ?
						(color as PaletteName)
					:	'primary';
				return (
					<Button
						key={tag.uid}
						size="small"
						onClick={() => {
							if (tags.has(tag.get('value'))) {
								tags.removeAll(tag.get('value'));
							} else {
								tags.add(tag.get('value'));
							}
						}}
						toggled={tags.has(tag.get('value'))}
						color={showColor}
						emphasis="light"
					>
						{tag.get('value')}
					</Button>
				);
			})}
			<AddTag
				onAdd={(tag) => {
					tags.add(tag.get('value'));
				}}
			/>
		</Box>
	);
}
