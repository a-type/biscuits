import {
	RecipeEditTagsContent,
	RecipeEditTagsRoot,
	RecipeEditTagsTrigger,
} from '@/components/recipes/editor/RecipeAddTag.js';
import { hooks } from '@/stores/groceries/index.js';
import { Box, IconName } from '@a-type/ui';
import { RemovableTag } from '@biscuits/client';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { Suspense } from 'react';

export interface RecipeTagsEditorProps {
	recipe: Recipe;
	className?: string;
}

// shows a list of applied tags with X buttons and a dropdown at the end
// which allows you to add a new tag
export function RecipeTagsEditor({ recipe, className }: RecipeTagsEditorProps) {
	const { tags } = hooks.useWatch(recipe);
	hooks.useWatch(tags);
	const removeTag = (name: string) => tags.removeAll(name);

	return (
		<Box gap="sm" wrap items="center" className={className}>
			{tags?.map((tag) => (
				<Suspense key={tag}>
					<TagDisplay tag={tag} onRemove={removeTag} />
				</Suspense>
			))}
			<Suspense>
				<RecipeEditTagsRoot>
					<RecipeEditTagsTrigger />
					<RecipeEditTagsContent recipe={recipe} />
				</RecipeEditTagsRoot>
			</Suspense>
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
	const data = hooks.useRecipeTagMetadata(tag);
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
