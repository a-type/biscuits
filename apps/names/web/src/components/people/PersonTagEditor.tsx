import { hooks } from '@/hooks.js';
import { Button, Dialog, Icon, IconName, ThemeName } from '@a-type/ui';
import { RemovableTag, TagCreateForm } from '@biscuits/client';
import { Person } from '@names.biscuits/verdant';
import { Suspense } from 'react';
import { TagFilter } from '../tags/TagFilter.js';

export interface PersonTagEditorProps {
	person: Person;
}

export function PersonTagEditor({ person }: PersonTagEditorProps) {
	const { tags } = hooks.useWatch(person);
	hooks.useWatch(tags);
	const removeTag = (name: string) => tags.removeAll(name);
	const toggleTag = (name: string) => {
		if (tags.has(name)) {
			tags.removeAll(name);
		} else {
			tags.add(name);
		}
	};
	const client = hooks.useClient();
	const createTag = async (init: {
		name: string;
		color?: ThemeName;
		icon?: IconName;
	}) => {
		const tag = await client.tags.put(init);
		tags.add(tag.get('name'));
	};
	return (
		<div className="flex flex-wrap gap-1 items-center">
			{tags?.map((tag) => (
				<Suspense key={tag}>
					<TagDisplay key={tag} tag={tag} onRemove={removeTag} />
				</Suspense>
			))}
			<Dialog>
				<Dialog.Trigger asChild>
					<Button size="small">
						<Icon name="plus" className="w-10px h-10px" />
						<span className="text-xs">tag</span>
					</Button>
				</Dialog.Trigger>
				<Dialog.Content className="flex flex-col">
					<Suspense>
						<TagFilter
							value={tags.getAll()}
							onToggle={toggleTag}
							className="mb-md"
						/>
						<TagCreateForm onCreate={createTag} defaultColor="leek" />
					</Suspense>
					<Dialog.Actions className="border-0 border-t border-solid border-gray-5">
						<Dialog.Close asChild>
							<Button>Done</Button>
						</Dialog.Close>
					</Dialog.Actions>
				</Dialog.Content>
			</Dialog>
		</div>
	);
}

function TagDisplay({
	tag,
	onRemove,
}: {
	tag: string;
	onRemove: (name: string) => void;
}) {
	const data = hooks.useTag(tag);
	hooks.useWatch(data);
	const icon = data?.get('icon') as IconName | undefined;
	const color = data?.get('color') as ThemeName | undefined;
	const name = data?.get('name') ?? tag;

	return (
		<RemovableTag
			icon={icon}
			color={color}
			name={name}
			onRemove={() => onRemove(tag)}
		/>
	);
}
