import { Icon } from '@/components/icons/Icon.jsx';
import { RecipeEditTags } from '@/components/recipes/editor/RecipeAddTag.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button, Chip, ThemeName } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { Cross2Icon } from '@radix-ui/react-icons';
import classNames from 'classnames';
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
		<div className={classNames('flex flex-wrap gap-1 items-center')}>
			{tags?.map((tag) => (
				<Suspense key={tag}>
					<TagDisplay key={tag} tag={tag} onRemove={removeTag} />
				</Suspense>
			))}
			<RecipeEditTags recipe={recipe} className="text-xs" />
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
	const data = hooks.useRecipeTagMetadata(tag);
	hooks.useWatch(data);
	const icon = data?.get('icon');
	const color = data?.get('color') as ThemeName | undefined;

	return (
		<Chip
			color="primary"
			className={classNames(
				'flex items-center gap-1 px-2 rounded-full !bg-primary-light color-black border-gray-7 font-bold text-xs',
				color && `theme-${color}`,
			)}
		>
			<span>{icon ?? <Icon name="tag" className="w-[10px] h-[10px]" />}</span>
			<span>{tag}</span>
			<Button
				size="icon"
				color="ghost"
				className="p-0"
				onClick={() => onRemove(tag)}
			>
				<Cross2Icon className="w-[10px] h-[10px]" />
			</Button>
		</Chip>
	);
}
