import { RecipeTagMenuWrapper } from '@/components/recipes/tags/RecipeTagMenuWrapper.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Box, Chip, Icon } from '@a-type/ui';
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
		<Box wrap gap="xs" className={classNames('@mode-denser', className)}>
			{content}
		</Box>
	);
}

function RecipeTagViewer({ tag }: { tag: string }) {
	const data = hooks.useRecipeTagMetadata(tag);
	hooks.useWatch(data);

	return (
		<RecipeTagMenuWrapper tagName={tag}>
			<Chip
				className={classNames(
					data?.get('color') && `@mode-${data.get('color')}`,
				)}
			>
				<span>
					{data?.get('icon') ?? (
						<Icon
							name="tag"
							style={{
								position: 'relative',
								top: -1,
							}}
							size={12}
						/>
					)}
				</span>
				<span>{tag}</span>
			</Chip>
		</RecipeTagMenuWrapper>
	);
}
