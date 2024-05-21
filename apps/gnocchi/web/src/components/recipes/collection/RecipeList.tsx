import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { EmptyState } from '@/components/recipes/collection/EmptyState.jsx';
import { PinnedRecipes } from '@/components/recipes/collection/PinnedRecipes.jsx';
import { RecipeCollectionMenu } from '@/components/recipes/collection/RecipeCollectionMenu.jsx';
import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import {
  RecipeListItem,
  RecipePlaceholderItem,
} from '@/components/recipes/collection/RecipeListItem.jsx';
import { RecipeSearchBar } from '@/components/recipes/collection/RecipeSearchBar.jsx';
import { useFeatureFlag } from '@biscuits/client';
import { Button } from '@a-type/ui/components/button';
import { CardGrid } from '@a-type/ui/components/card';
import { InfiniteLoadTrigger } from '@a-type/ui/components/infiniteLoadTrigger';
import { PageFixedArea } from '@a-type/ui/components/layouts';
import { Spinner } from '@a-type/ui/components/spinner';
import { Suspense } from 'react';
import { RecipeListActions } from './RecipeListActions.jsx';
import {
  useFilteredRecipes,
  useGridStyle,
  useRecipeTagFilter,
} from './hooks.js';
import { RecipeTagsList } from './RecipeTagsList.jsx';
import classNames from 'classnames';
import { RecipePresenceNotification } from '@/components/sync/collaborationMenu/RecipePresenceNotification.jsx';

export interface RecipeListProps {}

export function RecipeList({}: RecipeListProps) {
  return (
    <div className="flex flex-col p-0 m-0 mb-6 gap-2">
      <Suspense>
        <PageFixedArea className="pt-2 w-full mb-2">
          <div className="flex flex-row items-center justify-stretch w-full">
            <RecipeSearchBar className="flex-1" />
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
          <CardGrid>
            <RecipePlaceholderItem className="min-h-200px md:(h-30vh max-h-300px)" />
            <RecipePlaceholderItem className="min-h-200px md:(h-30vh max-h-300px)" />
            <RecipePlaceholderItem className="min-h-200px md:(h-30vh max-h-300px)" />
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
        className={classNames({
          'grid-cols-1 sm:grid-cols-2': gridStyle === 'card-big',
          'grid-cols-2 sm:grid-cols-3': gridStyle === 'card-small',
        })}
      >
        {recipes.map((recipe) => (
          <RecipeListItem
            key={recipe.get('id')}
            recipe={recipe}
            className="min-h-200px md:(h-30vh max-h-300px)"
          />
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
    <RecipeTagsList
      onSelect={toggleTagFilter}
      selectedValues={tagFilter ? [tagFilter] : []}
      onlySelected
      className="mb-4 font-normal text-xs"
      buttonClassName="py-1 px-2 text-xs"
    />
  );
}
