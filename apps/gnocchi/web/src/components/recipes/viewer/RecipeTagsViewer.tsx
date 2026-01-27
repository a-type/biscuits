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
	max?: number;
}

export function RecipeTagsViewer({
	recipe,
	limit,
	className,
	unwrapped,
	max,
}: RecipeTagsViewerProps) {
	const { tags } = hooks.useWatch(recipe);
	hooks.useWatch(tags);

	if (!tags) return null;

	const tagsToDisplay = limit ? tags.getSnapshot().slice(0, limit) : tags;

	const content = tagsToDisplay
		.map((tag) => (
			<Suspense key={tag}>
				<RecipeTagViewer tag={tag} />
			</Suspense>
		))
		.slice(0, max);

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
					data?.get('color') && `palette-${data.get('color')}`,
					'flex flex-row items-center gap-1 border rounded-full border-solid px-3 py-1 text-inherit font-bold color-black bg-main-light border-gray-dark',
				)}
			>
				<span>
					{data?.get('icon') ?? (
						<Icon name="tag" className="relative top-0.1em h-1em w-1em" />
					)}
				</span>
				<span>{tag}</span>
			</div>
		</RecipeTagMenuWrapper>
	);
}
