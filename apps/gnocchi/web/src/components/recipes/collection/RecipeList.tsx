import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { EmptyState } from '@/components/recipes/collection/EmptyState.jsx';
import { PinnedRecipes } from '@/components/recipes/collection/PinnedRecipes.jsx';
import { RecipeCollectionMenu } from '@/components/recipes/collection/RecipeCollectionMenu.jsx';
import {
	RecipeListItem,
	RecipePlaceholderItem,
} from '@/components/recipes/collection/RecipeListItem.jsx';
import { RecipeSearchBar } from '@/components/recipes/collection/RecipeSearchBar.jsx';
import { RecipePresenceNotification } from '@/components/sync/collaborationMenu/RecipePresenceNotification.jsx';
import {
	CardGrid,
	cardGridColumns,
	InfiniteLoadTrigger,
	PageFixedArea,
	Spinner,
} from '@a-type/ui';
import classNames from 'classnames';
import { Suspense } from 'react';
import { RecipeListActions } from './RecipeListActions.jsx';
import { RecipeTagsFilter } from './RecipeTagsFilter.jsx';
import {
	useFilteredRecipes,
	useGridStyle,
	useRecipeTagFilter,
} from './hooks.js';

export interface RecipeListProps {}

export function RecipeList({}: RecipeListProps) {
	return (
		<div className="flex flex-col p-0 m-0 mb-6 gap-2">
			<Suspense>
				<PageFixedArea className="pt-2 w-full mb-2">
					<div className="flex flex-row items-center justify-stretch w-full">
						<RecipeSearchBar className="flex-1 flex-basis-0" />
						<RecipeCollectionMenu className="flex-0-0-auto" />
					</div>
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

			<Suspense
				fallback={
					<CardGrid className="z-1">
						<RecipePlaceholderItem className="min-h-200px md:(h-30dvh max-h-300px)" />
						<RecipePlaceholderItem className="min-h-200px md:(h-30dvh max-h-300px)" />
						<RecipePlaceholderItem className="min-h-200px md:(h-30dvh max-h-300px)" />
					</CardGrid>
				}
			>
				<RecipeListContent />
				<AutoRestoreScroll id="recipesList" />
			</Suspense>
		</div>
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
				className={classNames('z-1', {
					'grid-cols-1 sm:grid-cols-2': gridStyle === 'card-big',
					'grid-cols-2 sm:grid-cols-3': gridStyle === 'card-small',
				})}
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
				<InfiniteLoadTrigger onVisible={loadMore} className="mt-6 w-full">
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
			className="mb-1 font-normal text-xs"
			buttonClassName="py-1 px-2 text-xs"
		/>
	);
}
