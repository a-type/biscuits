import { hooks } from '@/hooks.js';
import {
	Box,
	Button,
	clsx,
	Collapsible,
	Dialog,
	FieldLabel,
	Icon,
	IconName,
	PaletteName,
	ThemeName,
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
		color?: ThemeName;
		icon?: IconName;
	}) => {
		const tag = await client.tags.put({
			...init,
			name: init.name.trim().toLowerCase(),
		});
		tags.add(tag.get('name'));
	};
	return (
		<div className={clsx('flex flex-wrap gap-1 items-center', className)}>
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
						<FieldLabel>Edit tags</FieldLabel>
						<TagFilter
							value={tags.getAll()}
							onToggle={toggleTag}
							className="mb-md"
						/>
						<Collapsible className="w-full">
							<Collapsible.Trigger asChild>
								<Button size="small">
									<Icon name="plus" className="w-10px h-10px" />
									<span className="text-xs">New tag</span>
								</Button>
							</Collapsible.Trigger>
							<Collapsible.Content className="w-full ">
								<Box className="w-full mt-sm" surface color="primary" p>
									<TagCreateForm
										onCreate={createTag}
										defaultColor="leek"
										className="w-full"
									/>
								</Box>
							</Collapsible.Content>
						</Collapsible>
					</Suspense>
					<Dialog.Actions className="border-0 border-t border-solid border-gray">
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
	const color = data?.get('color') as PaletteName | undefined;
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
