import { Route } from '@/routes/recipes/index.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { useLocalStorage } from '@biscuits/client';
import { useCallback, useMemo } from 'react';
import { removeStopwords } from 'stopword';
import { RECIPE_PINNED_CUTOFF } from '../constants.js';

export function useRecipeTagFilter() {
	const { tag } = Route.useSearch();
	const navigate = Route.useNavigate();

	const setTag = useCallback(
		(tag: string | null) => {
			navigate({
				search: {
					tag: tag || undefined,
				},
			});
		},
		[navigate],
	);

	return [tag, setTag] as const;
}

export function useRecipeFoodFilter() {
	const { food } = Route.useSearch();
	const navigate = Route.useNavigate();

	const setFood = useCallback(
		(food: string | null) => {
			navigate({
				search: {
					food: food || undefined,
				},
			});
		},
		[navigate],
	);

	return [food, setFood] as const;
}

export function useRecipeTitleFilter() {
	const { search: value } = Route.useSearch();
	const navigate = Route.useNavigate();

	const setValue = useCallback(
		(value: string | null) => {
			navigate({
				search: {
					search: value || undefined,
				},
			});
		},
		[navigate],
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
	const normalizedTitleWords =
		titleFilter?.toLowerCase().trim()?.split(/\s+/) ?? [];
	const firstTitleWord = removeStopwords(normalizedTitleWords)[0];
	const hasTitleFilter = !!titleFilter;

	const [rawRecipes, meta] = hooks.useAllRecipesInfinite(
		firstTitleWord
			? {
					index: {
						where: 'generalSearch',
						startsWith: firstTitleWord,
					},
					key: 'recipes',
			  }
			: normalizedTagFilter
			? {
					index: {
						where: 'tag',
						equals: normalizedTagFilter,
					},
					key: 'recipes',
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

export function usePinnedRecipes() {
	// prevent thrashing
	const endOfDay = useMemo(() => {
		const date = new Date();
		date.setHours(23, 59, 59, 999);
		return date.getTime();
	}, []);
	return hooks.useAllRecipes({
		index: {
			where: 'pinnedAt',
			gt: RECIPE_PINNED_CUTOFF,
			lt: endOfDay,
		},
		key: 'pinnedRecipes',
	});
}
