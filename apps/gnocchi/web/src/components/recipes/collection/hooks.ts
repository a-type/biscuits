import { useCallback } from 'react';
import { useSearchParams } from '@verdant-web/react-router';
import { hooks } from '@/stores/groceries/index.js';
import { useLocalStorage } from '@biscuits/client';
import { removeStopwords } from 'stopword';

export function useRecipeTagFilter() {
  const [params, setParams] = useSearchParams();
  const tag = params.get('tag');

  const setTag = useCallback(
    (tag: string | null) => {
      if (tag) {
        setParams(
          (params) => {
            params.set('tag', tag);
            return params;
          },
          { state: { noUpdate: true } },
        );
      } else {
        setParams(
          (params) => {
            params.delete('tag');
            return params;
          },
          { state: { noUpdate: true } },
        );
      }
    },
    [setParams],
  );

  return [tag, setTag] as const;
}

export function useRecipeFoodFilter() {
  const [params, setParams] = useSearchParams();
  const food = params.get('food');

  const setFood = useCallback(
    (food: string | null) => {
      if (food) {
        setParams(
          (params) => {
            params.set('food', food);
            return params;
          },
          { state: { noUpdate: true } },
        );
      } else {
        setParams(
          (params) => {
            params.delete('food');
            return params;
          },
          { state: { noUpdate: true } },
        );
      }
    },
    [setParams],
  );

  return [food, setFood] as const;
}

export function useRecipeTitleFilter() {
  const [params, setParams] = useSearchParams();
  const value = params.get('search') || '';

  const setValue = useCallback(
    (value: string | null) => {
      if (value) {
        setParams(
          (params) => {
            params.set('search', value);
            return params;
          },
          { state: { noUpdate: true } },
        );
      } else {
        setParams(
          (params) => {
            params.delete('search');
            return params;
          },
          { state: { noUpdate: true } },
        );
      }
    },
    [setParams],
  );

  return [value, setValue] as const;
}

export function useIsFiltered() {
  const [tagFilter] = useRecipeTagFilter();
  const [titleFilter] = useRecipeTitleFilter();

  return !!tagFilter || !!titleFilter;
}

export function useFilteredRecipes() {
  const [tagFilter] = useRecipeTagFilter();
  const [titleFilter] = useRecipeTitleFilter();

  // just in... 'case'
  const normalizedTagFilter = tagFilter?.toLowerCase().trim();
  const normalizedFoodFilter = titleFilter?.toLowerCase().trim();
  // only the first word
  const normalizedTitleWords = titleFilter?.toLowerCase().trim()?.split(/\s+/);
  const firstTitleWord = removeStopwords(normalizedTitleWords)[0];
  const hasTitleFilter = !!titleFilter;

  const [rawRecipes, meta] = hooks.useAllRecipesInfinite(
    firstTitleWord
      ? {
          index: {
            where: 'generalSearch',
            startsWith: firstTitleWord,
          },
          key: 'recipesSearch',
        }
      : normalizedTagFilter
      ? {
          index: {
            where: 'tag',
            equals: normalizedTagFilter,
          },
          key: 'recipesByTag',
        }
      : {
          key: 'recipes',
          index: {
            where: 'updatedAt',
            order: 'desc',
          },
        },
  );

  // filter for the un-indexed filters
  const recipes = rawRecipes.filter((recipe) => {
    // if more than one word was searched
    if (normalizedTitleWords?.length > 1) {
      if (
        !normalizedTitleWords.every((word) =>
          recipe.get('title').toLowerCase().includes(word),
        )
      )
        return false;
    }
    // a tag filter exists, but another filter took precedence
    if (normalizedTagFilter && (normalizedFoodFilter || hasTitleFilter)) {
      if (
        !recipe
          .get('tags')
          .getSnapshot()
          .some((tag) => tag.toLowerCase() === normalizedTagFilter)
      )
        return false;
    }

    // // a food filter exists, but another filter took precedence
    // if (normalizedFoodFilter && hasTitleFilter) {
    //   if (
    //     !recipe
    //       .get('ingredients')
    //       .getSnapshot()
    //       .some(
    //         (ingredient) =>
    //           ingredient.food &&
    //           ingredient.food.toLowerCase() === normalizedFoodFilter,
    //       )
    //   )
    //     return false;
    // }

    return true;
  });

  return [recipes, meta] as const;
}

export const gridStyles = ['card-big', 'card-small'] as const;
export type GridStyle = (typeof gridStyles)[number];
export function useGridStyle() {
  return useLocalStorage<GridStyle>('recipeGridStyle', 'card-big');
}
