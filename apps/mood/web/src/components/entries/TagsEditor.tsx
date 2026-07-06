import { hooks } from '@/hooks.js';
import { Box, Button } from '@a-type/ui';
import { EntryTags } from '@mood.biscuits/verdant';
import { AddTag } from './AddTag.jsx';

export interface TagsEditorProps {
	tags: EntryTags;
}

export function TagsEditor({ tags }: TagsEditorProps) {
	const allTags = hooks.useAllTagMetadata({
		index: {
			where: 'useCount',
			order: 'desc',
		},
	});
	hooks.useWatch(tags);
	const client = hooks.useClient();

	return (
		<Box wrap gap p items="center">
			{allTags.map((tag) => {
				const color = tag.get('color');
				const showColor =
					(
						['lemon', 'leek', 'tomato', 'eggplant', 'blueberry'].includes(
							color as any,
						)
					) ?
						color
					:	'primary';
				return (
					<Button
						key={tag.uid}
						size="small"
						onClick={() => {
							if (tags.has(tag.get('value'))) {
								client
									.batch()
									.run(() => {
										tags.removeAll(tag.get('value'));
										tag.set('useCount', tag.get('useCount') - 1);
									})
									.commit();
							} else {
								client
									.batch()
									.run(() => {
										tags.add(tag.get('value'));
										tag.set('useCount', tag.get('useCount') + 1);
									})
									.commit();
							}
						}}
						toggled={tags.has(tag.get('value'))}
						color={showColor as any}
						emphasis="light"
					>
						{tag.get('value')}
					</Button>
				);
			})}
			<AddTag
				onAdd={(tag) => {
					client
						.batch()
						.run(() => {
							tags.add(tag.get('value'));
							tag.set('useCount', tag.get('useCount') + 1);
						})
						.commit();
				}}
			/>
		</Box>
	);
}
