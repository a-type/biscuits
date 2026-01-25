import { useDebouncedValue } from '@/hooks/useDebouncedValue.js';
import { hooks } from '@/stores/groceries/index.js';
import { useParticles } from '@a-type/ui';
import { useLocalStorage } from '@biscuits/client';
import { depluralize } from '@gnocchi.biscuits/conversion';
import { Food, Recipe } from '@gnocchi.biscuits/verdant';
import { addDays, startOfDay } from 'date-fns';
import pluralize from 'pluralize';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import { useExpiresSoonItems } from '../../pantry/hooks.js';
import { groceriesState } from '../state.js';

export type SuggestionData =
	| {
			type: 'raw';
			text: string;
			id: string;
	  }
	| {
			type: 'food';
			name: string;
			id: string;
	  }
	| {
			type: 'recipe';
			recipe: Recipe;
			id: string;
	  }
	| {
			type: 'url';
			url: string;
			id: string;
	  };

export type SuggestionGroup = {
	items: SuggestionData[];
	label: string;
	id: string;
};

const randomPlaceholders = [
	'Add an item...',
	'Add an item...',
	'Add an item...',
	'Add an item...',
	'dozen eggs',
	'¼ cup sugar',
	'garlic',
	'1 cup flour',
	'1 lb spaghetti',
	'Try pasting a list!',
];
function getRandomPlaceholder() {
	return randomPlaceholders[
		Math.floor(Math.random() * randomPlaceholders.length)
	];
}

const mapRecipesToSuggestions = (
	recipes: Recipe[],
	limit = 5,
): SuggestionData[] => {
	return recipes
		.sort((a, b) => {
			return a.get('cookCount') > b.get('cookCount') ? -1 : 1;
		})
		.slice(0, limit)
		.map((s) => ({
			type: 'recipe',
			recipe: s,
			id: s.get('id'),
		}));
};

/**
 * Pulls out any leading quantity number, and the first
 * whole word, then the rest of the string.
 */
export function destructureSearchPrompt(prompt: string): {
	quantity: string;
	firstWord: string;
	rest: string;
} {
	if (!prompt) return { firstWord: '', rest: '', quantity: '' };
	if (prompt.length === 1) return { firstWord: prompt, rest: '', quantity: '' };
	const match = prompt.match(/^(\d+)?\s?(\w+)?\s?(.*)$/);
	if (!match) return { firstWord: '', rest: '', quantity: '' };
	const [, quantity = '', firstWord = '', rest = ''] = match;
	return { quantity, firstWord, rest };
}

export function suggestionToString(item: SuggestionData | undefined | null) {
	if (!item) return '';
	if (item.type === 'food') return item.name;
	if (item.type === 'recipe') return item.recipe.get('title');
	return '';
}

export function suggestionToDisplayString(item: SuggestionData) {
	if (item.type === 'raw') return item.text;
	if (item.type === 'food') return item.name;
	if (item.type === 'recipe') return item.recipe.get('title');
	if (item.type === 'url') return item.url;
	return '';
}

const NOW = startOfDay(new Date()).getTime();
const SUGGESTION_INTERVAL_END = addDays(NOW, 5).getTime();

export function useAddBarSuggestions({
	showRichSuggestions,
	suggestionPrompt,
}: {
	showRichSuggestions: boolean;
	suggestionPrompt: string;
}) {
	const [randomPlaceholder] = useState(getRandomPlaceholder);

	const { data: existingItems } = hooks.useAllItemsUnsuspended({
		index: {
			where: 'purchased',
			equals: 'no',
		},
	});
	const existingFoods = useMemo(() => {
		const foods = new Set<string>();
		existingItems.forEach((item) => {
			foods.add(item.get('food').toLowerCase());
		});
		return foods;
	}, [existingItems]);

	const foodSearchPrompt = suggestionPrompt
		? depluralize(suggestionPrompt.toLowerCase().trim())
		: '';

	const { firstWord, quantity } = destructureSearchPrompt(foodSearchPrompt);
	const foodMatchPrompt = foodSearchPrompt.replace(quantity, '').trim();

	const { data: searchFoods } = hooks.useAllFoodsUnsuspended({
		index: {
			where: 'nameLookup',
			// only use first word... only one word can match the index.
			startsWith: firstWord,
		},
		limit: 20,
		key: 'addBar_searchFoods',
		skip: !foodSearchPrompt,
	});

	const frequencyFoods = hooks.useAllFoods({
		index: {
			where: 'repurchaseAfter',
			gt: NOW,
			lt: SUGGESTION_INTERVAL_END,
			order: 'desc',
		},
		skip: !showRichSuggestions,
		key: 'addBar_frequencyFoods',
	});

	const expiresSoonItems = useExpiresSoonItems({
		skip: !showRichSuggestions,
		key: 'addBar_expiresSoon',
	});

	const mapFoodsToSuggestions = useCallback(
		(foods: Food[], limit = 5): SuggestionData[] => {
			return foods
				.filter((item) => !item.get('doNotSuggest'))
				.filter((item) => {
					return !existingFoods.has(item.get('canonicalName').toLowerCase());
				})
				.sort((a, b) => {
					return a.get('purchaseCount') > b.get('purchaseCount') ? -1 : 1;
				})
				.slice(0, limit)
				.map((s) => {
					if (s.get('pluralizeName'))
						return pluralize(s.get('canonicalName').toLowerCase());
					else return s.get('canonicalName').toLowerCase();
				})
				.map((s) => ({
					type: 'food',
					name: s,
					id: s,
				}));
		},
		[existingFoods],
	);

	const expiresSoonSuggestions = useMemo<SuggestionData[]>(() => {
		return mapFoodsToSuggestions(expiresSoonItems);
	}, [expiresSoonItems, mapFoodsToSuggestions]);

	const frequencyFoodsSuggestions = useMemo<SuggestionData[]>(() => {
		return mapFoodsToSuggestions(frequencyFoods);
	}, [frequencyFoods, mapFoodsToSuggestions]);

	const frequencyRecipes = hooks.useAllRecipes({
		index: {
			where: 'suggestAfter',
			gt: NOW,
			lt: SUGGESTION_INTERVAL_END,
			order: 'desc',
		},
		skip: !showRichSuggestions,
		key: 'addBar_frequencyRecipes',
	});
	const recipeSuggestions = useMemo<SuggestionData[]>(() => {
		return mapRecipesToSuggestions(frequencyRecipes);
	}, [frequencyRecipes]);

	const hasFewSuggestions =
		frequencyFoodsSuggestions.length +
			recipeSuggestions.length +
			expiresSoonSuggestions.length <
		10;

	const searchFoodsSuggestions = useMemo<SuggestionData[]>(() => {
		return mapFoodsToSuggestions(
			searchFoods.filter((food) => {
				if (food.get('canonicalName').toLowerCase().includes(foodMatchPrompt))
					return true;
				for (const name in food.get('alternateNames')) {
					if (name.toLowerCase().includes(foodMatchPrompt)) return true;
				}
				return false;
			}),
			20,
		);
	}, [searchFoods, mapFoodsToSuggestions, foodMatchPrompt]);

	const favoriteFoods = hooks.useAllFoods({
		index: {
			where: 'purchaseCount',
			order: 'desc',
		},
		limit: 20,
		key: 'addBar_favoriteFoods',
		skip: !!foodSearchPrompt,
	});

	const favoriteFoodsSuggestions = useMemo<SuggestionData[]>(() => {
		return mapFoodsToSuggestions(favoriteFoods, hasFewSuggestions ? 20 : 10);
	}, [favoriteFoods, mapFoodsToSuggestions, hasFewSuggestions]);

	const { data: searchRecipes } = hooks.useAllRecipesUnsuspended({
		index: {
			where: 'titleMatch',
			startsWith: suggestionPrompt?.toLowerCase().trim() ?? '',
		},
		skip: !showRichSuggestions || !suggestionPrompt,
		key: 'addBar_searchRecipes',
	});
	const searchRecipeSuggestions = useMemo<SuggestionData[]>(() => {
		return mapRecipesToSuggestions(searchRecipes);
	}, [searchRecipes]);

	const showSuggested =
		!suggestionPrompt &&
		showRichSuggestions &&
		frequencyFoodsSuggestions.length + recipeSuggestions.length > 0;

	const showExpiring =
		!suggestionPrompt &&
		showRichSuggestions &&
		expiresSoonSuggestions.length > 0;

	const showRecipeMatches = !!suggestionPrompt && showRichSuggestions;

	const groupedSuggestions = useMemo(() => {
		const groups: SuggestionGroup[] = [];
		if (showSuggested) {
			groups.push({
				label: 'Suggested',
				id: 'suggested',
				items: [
					...frequencyFoodsSuggestions,
					...(showRecipeMatches ? recipeSuggestions : []),
				],
			});
		}
		if (showExpiring) {
			groups.push({
				label: 'Expiring Soon',
				id: 'expiringSoon',
				items: expiresSoonSuggestions,
			});
		}
		if (suggestionPrompt) {
			groups.push({
				label: 'Matching foods',
				id: 'matchingFoods',
				items: searchFoodsSuggestions,
			});
		} else {
			groups.push({
				label: 'Favorite foods',
				id: 'favoriteFoods',
				items: favoriteFoodsSuggestions,
			});
		}
		if (showRecipeMatches && searchRecipeSuggestions.length > 0) {
			groups.push({
				label: 'Matching recipes',
				id: 'matchingRecipes',
				items: searchRecipeSuggestions,
			});
		}
		return groups;
	}, [
		searchFoodsSuggestions,
		frequencyFoodsSuggestions,
		recipeSuggestions,
		expiresSoonSuggestions,
		searchRecipeSuggestions,
		showSuggested,
		showExpiring,
		showRecipeMatches,
		favoriteFoodsSuggestions,
		suggestionPrompt,
	]);

	const allSuggestions = useMemo(() => {
		return groupedSuggestions.flatMap((group) => group.items);
	}, [groupedSuggestions]);

	const randomSuggestion = useDebouncedValue(
		() => {
			if (allSuggestions.length === 0) return null;
			return allSuggestions[Math.floor(Math.random() * allSuggestions.length)];
		},
		15000,
		[allSuggestions],
	);
	const placeholder = randomSuggestion
		? suggestionToString(randomSuggestion)
		: randomPlaceholder;

	return {
		groupedSuggestions,
		placeholder,
	};
}

export function useKeepOpenAfterSelect() {
	return useLocalStorage('addBar_keepOpenAfterSelect', false);
}

export function useParticlesOnAdd(enabled: boolean = true) {
	const { justAddedSomething } = useSnapshot(groceriesState);
	const ref = useRef<HTMLButtonElement>(null);
	const particles = useParticles();
	useEffect(() => {
		if (justAddedSomething && enabled) {
			if (ref.current) {
				particles?.addParticles(
					particles.elementExplosion({
						element: ref.current,
						count: 20,
					}),
				);
			}
		}
	}, [justAddedSomething, particles, enabled]);
	return ref;
}
