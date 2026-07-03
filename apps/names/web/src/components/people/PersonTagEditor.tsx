import { hooks } from '@/hooks.js';
import {
	Box,
	Button,
	Collapsible,
	Dialog,
	Field,
	Icon,
	IconName,
} from '@a-type/ui';
import { RemovableTag, TagCreateForm } from '@biscuits/client';
import { Person } from '@names.biscuits/verdant';
import { Suspense } from 'react';
import { TagFilter } from '../tags/TagFilter.js';

export interface PersonTagEditorProps {
	person: Person;
	className?: string;
}

export function PersonTagEditor({ person, className }: PersonTagEditorProps) {
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
		color?: string;
		icon?: IconName;
	}) => {
		const tag = await client.tags.put({
			...init,
			name: init.name.trim().toLowerCase(),
		});
		tags.add(tag.get('name'));
	};
	return (
		<Box wrap items="center" gap="xs" className={className}>
			{tags?.map((tag) => (
				<Suspense key={tag}>
					<TagDisplay key={tag} tag={tag} onRemove={removeTag} />
				</Suspense>
			))}
			<Dialog>
				<Dialog.Trigger render={<Button size="small" emphasis="ghost" />}>
					<Icon name="plus" />
					tag
				</Dialog.Trigger>
				<Dialog.Content>
					<Suspense>
						<Field>
							<Field.Label>Edit tags</Field.Label>
							<Field.Control
								render={
									<TagFilter
										value={tags.getAll()}
										onToggle={toggleTag}
										className="mb-md"
									/>
								}
							/>
						</Field>
						<Collapsible className="w-full">
							<Collapsible.Trigger render={<Button size="small" />}>
								<Icon name="plus" />
								New tag
							</Collapsible.Trigger>
							<Collapsible.Content className="w-full">
								<Box className="w-full" surface color="primary" p>
									<TagCreateForm
										onCreate={createTag}
										defaultColor="leek"
										className="w-full"
									/>
								</Box>
							</Collapsible.Content>
						</Collapsible>
					</Suspense>
					<Dialog.Actions>
						<Dialog.Close>Done</Dialog.Close>
					</Dialog.Actions>
				</Dialog.Content>
			</Dialog>
		</Box>
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
	const color = data?.get('color') as string | undefined;
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
