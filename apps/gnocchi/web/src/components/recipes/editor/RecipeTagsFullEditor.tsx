import { hooks } from '@/stores/groceries/index.js';
import { Combobox, Icon, IconName, PaletteName, clsx } from '@a-type/ui';
import { Recipe, RecipeTagMetadata } from '@gnocchi.biscuits/verdant';
import { useState } from 'react';

export interface RecipeTagsFullEditorProps {
	recipe: Recipe;
	className?: string;
}

const TagCombobox = Combobox.create<RecipeTagMetadata>();

// shows a list of applied tags with X buttons and a dropdown at the end
// which allows you to add a new tag
export function RecipeTagsFullEditor({
	recipe,
	className,
}: RecipeTagsFullEditorProps) {
	const { tags } = hooks.useWatch(recipe);
	hooks.useWatch(tags);
	const client = hooks.useClient();
	const allTags = hooks.useAllRecipeTagMetadata();

	const mappedValues = tags
		.getAll()
		.map((tag) => tag.toLowerCase())
		.map((tag) =>
			allTags.find((t) => (t.get('name') as string).toLowerCase() === tag),
		)
		.filter((t) => !!t);

	const [inputValue, setInputValue] = useState('');

	return (
		<TagCombobox.Multi
			inputValue={inputValue}
			onInputValueChange={setInputValue}
			items={allTags}
			value={mappedValues}
			itemToStringValue={(tag) => tag?.get('name') || ''}
			itemToStringLabel={(tag) => tag?.get('name') || ''}
			onValueChange={(value) => {
				const currentTags = new Set(tags.getAll());
				const newTags = new Set(value.map((t) => t.get('name') as string));

				// Tags to add
				for (const tag of newTags) {
					if (!currentTags.has(tag)) {
						tags.add(tag);
					}
				}

				// Tags to remove
				for (const tag of currentTags) {
					if (!newTags.has(tag)) {
						tags.removeAll(tag);
					}
				}
			}}
			onCreate={async (tagName) => {
				const name = tagName.trim().toLowerCase();
				await client.recipeTagMetadata.put({
					name,
					color: ['lemon', 'blueberry', 'tomato', 'eggplant', 'leek'][
						Math.floor(Math.random() * 5)
					],
				});
				tags.add(name);
			}}
		>
			<TagCombobox.Chips className={clsx('w-full flex flex-row', className)}>
				<TagCombobox.MultiValue className="flex-1">
					{(tags) => (
						<>
							<TagCombobox.ChipsList>
								{tags.map((tag) => (
									<TagCombobox.Chip
										key={tag.get('name')}
										color={tag.get('color') as PaletteName}
									>
										<TagDisplay tag={tag} />
									</TagCombobox.Chip>
								))}
							</TagCombobox.ChipsList>
							<TagCombobox.Input placeholder="Add tag..." />
						</>
					)}
				</TagCombobox.MultiValue>
			</TagCombobox.Chips>
			<TagCombobox.Content>
				<TagCombobox.List className="flex flex-row flex-wrap gap-sm p-sm">
					{(tag) => (
						<TagCombobox.GroupItem
							value={tag}
							key={tag.get('name')}
							color={tag.get('color') as PaletteName}
						>
							<TagDisplay tag={tag} />
						</TagCombobox.GroupItem>
					)}
				</TagCombobox.List>
				<TagCombobox.Empty className="flex flex-row items-center justify-end gap-sm">
					<Icon name="enterKey" /> Press enter to create new tag "{inputValue}"
				</TagCombobox.Empty>
			</TagCombobox.Content>
		</TagCombobox.Multi>
	);
}

function TagDisplay({ tag: data }: { tag: RecipeTagMetadata }) {
	hooks.useWatch(data);
	const icon = data?.get('icon') as IconName | undefined;
	const color = data?.get('color') as PaletteName | undefined;

	const name = data?.get('name') ?? 'unknown';

	return (
		<>
			<Icon name={(icon as IconName) ?? 'tag'} color={color as PaletteName} />
			{name}
		</>
	);
}
