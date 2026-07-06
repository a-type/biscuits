import { EmptyState } from '@/components/recipes/collection/EmptyState.jsx';
import { PinnedRecipes } from '@/components/recipes/collection/PinnedRecipes.jsx';
import { RecipeCollectionMenu } from '@/components/recipes/collection/RecipeCollectionMenu.jsx';
import { RecipeListItem } from '@/components/recipes/collection/RecipeListItem.jsx';
import { RecipeSearchBar } from '@/components/recipes/collection/RecipeSearchBar.jsx';
import { RecipePresenceNotification } from '@/components/sync/collaborationMenu/RecipePresenceNotification.jsx';
import {
	Box,
	CardGrid,
	cardGridColumns,
	InfiniteLoadTrigger,
	PageFixedArea,
	Spinner,
} from '@a-type/ui';
import classNames from 'classnames';
import { Suspense } from 'react';
import {
	useFilteredRecipes,
	useGridStyle,
	useRecipeTagFilter,
} from './hooks.js';
import cls from './RecipeList.module.css';
import { RecipeListActions } from './RecipeListActions.jsx';
import { RecipeTagsFilter } from './RecipeTagsFilter.jsx';

export interface RecipeListProps {}

export function RecipeList({}: RecipeListProps) {
	return (
		<Box col gap="sm" className={cls.root}>
			<Suspense>
				<PageFixedArea className={cls.controls}>
					<Box full="width" items="center" justify="stretch">
						<RecipeSearchBar className={cls.search} />
						<RecipeCollectionMenu className={cls.menu} />
					</Box>
					<RecipeListActions />
				</PageFixedArea>
			</Suspense>
			<RecipePresenceNotification />

			<Suspense>
				<PinnedRecipes />
			</Suspense>

			<Suspense>
				<TagFilterList />
			</Suspense>

			<RecipeListContent />
		</Box>
	);
}

function RecipeListContent() {
	const [recipes, { loadMore, hasMore }] = useFilteredRecipes();
	const [gridStyle] = useGridStyle();

	if (!recipes.length) {
		return <EmptyState />;
	}

	return (
		<>
			<CardGrid
				className={classNames(cls.grid)}
				data-style={gridStyle}
				columns={
					gridStyle === 'card-big'
						? cardGridColumns.default
						: cardGridColumns.small
				}
			>
				{recipes.map((recipe) => (
					<RecipeListItem key={recipe.get('id')} recipe={recipe} />
				))}
			</CardGrid>
			{hasMore && (
				<InfiniteLoadTrigger onVisible={loadMore} className={cls.loadTrigger}>
					<Spinner />
				</InfiniteLoadTrigger>
			)}
		</>
	);
}

function TagFilterList() {
	const [tagFilter, setTagFilter] = useRecipeTagFilter();
	const toggleTagFilter = (value: string | null) =>
		tagFilter ? setTagFilter(null) : setTagFilter(value);

	return (
		<RecipeTagsFilter
			onSelect={toggleTagFilter}
			selectedValues={tagFilter ? [tagFilter] : []}
			className={cls.tagsFilter}
		/>
	);
}
