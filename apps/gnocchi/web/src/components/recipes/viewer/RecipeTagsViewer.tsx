import { RecipeTagMenuWrapper } from '@/components/recipes/tags/RecipeTagMenuWrapper.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Icon } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import classNames from 'classnames';
import { Suspense } from 'react';

export interface RecipeTagsViewerProps {
	recipe: Recipe;
	limit?: number;
	className?: string;
	unwrapped?: boolean;
}

export function RecipeTagsViewer({
	recipe,
	limit,
	className,
	unwrapped,
}: RecipeTagsViewerProps) {
	const { tags } = hooks.useWatch(recipe);
	hooks.useWatch(tags);

	if (!tags) return null;

	const tagsToDisplay = limit ? tags.getSnapshot().slice(0, limit) : tags;

	const content = tagsToDisplay.map((tag) => (
		<Suspense key={tag}>
			<RecipeTagViewer tag={tag} />
		</Suspense>
	));

	if (unwrapped) {
		return <>{content}</>;
	}

	return (
		<div className={classNames('flex flex-wrap gap-1 text-sm', className)}>
			{content}
		</div>
	);
}

function RecipeTagViewer({ tag }: { tag: string }) {
	const data = hooks.useRecipeTagMetadata(tag);
	hooks.useWatch(data);

	return (
		<RecipeTagMenuWrapper tagName={tag}>
			<div
				className={classNames(
					'flex flex-row items-center gap-1 px-3 py-1 rounded-full bg-primary-light border border-solid border-gray-dark color-black font-bold text-inherit',
					data?.get('color') && `theme-${data.get('color')}`,
				)}
			>
				<span>
					{data?.get('icon') ?? (
						<Icon name="tag" className="w-1em h-1em relative top-0.1em" />
					)}
				</span>
				<span>{tag}</span>
			</div>
		</RecipeTagMenuWrapper>
	);
}
