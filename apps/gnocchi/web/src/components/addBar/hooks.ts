import { useDebouncedValue } from '@/hooks/useDebouncedValue.js';
import { hooks } from '@/stores/groceries/index.js';
import { isUrl } from '@a-type/utils';
import {
	showSubscriptionPromotion,
	useHasServerAccess,
	useLocalStorage,
	useOnPointerDownOutside,
} from '@biscuits/client';
import { depluralize } from '@gnocchi.biscuits/conversion';
import { Food, Recipe } from '@gnocchi.biscuits/verdant';
import { addDays, startOfDay } from 'date-fns';
import pluralize from 'pluralize';
import {
	ComponentProps,
	KeyboardEvent,
	MutableRefObject,
	startTransition,
	useCallback,
	useId,
	useMemo,
	useState,
} from 'react';
import { useExpiresSoonItems } from '../pantry/hooks.js';
import { recipeSavePromptState } from '../recipes/savePrompt/state.js';

export type SuggestionData =
	| {
			type: 'raw';
			text: string;
			id: string;
			index?: number;
	  }
	| {
			type: 'food';
			name: string;
			id: string;
			ai?: boolean;
			index?: number;
	  }
	| {
			type: 'recipe';
			recipe: Recipe;
			id: string;
			index?: number;
	  }
	| {
			type: 'url';
			url: string;
			id: string;
			index?: number;
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
function destructureSearchPrompt(prompt: string): {
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

function addIndex(item: SuggestionData, indexRef: MutableRefObject<number>) {
	item.index = indexRef.current++;
	return item;
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
			foods.add(item.get('food'));
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
				.filter((item) => !existingFoods.has(item.get('canonicalName')))
				.sort((a, b) => {
					return a.get('purchaseCount') > b.get('purchaseCount') ? -1 : 1;
				})
				.slice(0, limit)
				.map((s) => {
					if (s.get('pluralizeName')) return pluralize(s.get('canonicalName'));
					else return s.get('canonicalName');
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
				if (food.get('canonicalName').includes(foodMatchPrompt)) return true;
				for (const name in food.get('alternateNames')) {
					if (name.includes(foodMatchPrompt)) return true;
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

	const allSuggestions = useMemo(() => {
		const allSuggestions: SuggestionData[] = [];
		const indexRef = { current: 0 };
		if (showSuggested) {
			allSuggestions.push(
				...frequencyFoodsSuggestions.map((s) => addIndex(s, indexRef)),
			);
			if (showRecipeMatches) {
				allSuggestions.push(
					...recipeSuggestions.map((s) => addIndex(s, indexRef)),
				);
			}
		}
		if (showExpiring) {
			allSuggestions.push(
				...expiresSoonSuggestions.map((s) => addIndex(s, indexRef)),
			);
		}
		allSuggestions.push(
			...favoriteFoodsSuggestions.map((s) => addIndex(s, indexRef)),
		);
		allSuggestions.push(
			...searchFoodsSuggestions.map((s) => addIndex(s, indexRef)),
		);
		if (showRecipeMatches) {
			allSuggestions.push(
				...searchRecipeSuggestions.map((s) => addIndex(s, indexRef)),
			);
		}
		return allSuggestions;
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
	]);

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

	const mainSuggestions = useMemo(() => {
		return [
			...frequencyFoodsSuggestions,
			...(showRecipeMatches ? recipeSuggestions : []),
		];
	}, [frequencyFoodsSuggestions, recipeSuggestions, showRecipeMatches]);

	const foodMatchSuggestions = useMemo(() => {
		return [...favoriteFoodsSuggestions, ...searchFoodsSuggestions];
	}, [searchFoodsSuggestions, favoriteFoodsSuggestions]);

	return {
		allSuggestions,
		placeholder,
		showSuggested,
		frequencyFoodsSuggestions,
		recipeSuggestions,
		showExpiring,
		expiresSoonSuggestions,
		searchFoodsSuggestions,
		showRecipeMatches,
		searchRecipeSuggestions,
		mainSuggestions,
		foodMatchSuggestions,
		recipeMatchSuggestions: searchRecipeSuggestions,
	};
}

export function useAddBarCombobox({
	setSuggestionPrompt,
	allSuggestions,
	onAdd,
	open,
	onOpenChange,
	reverse,
}: {
	setSuggestionPrompt: (val: string) => void;
	allSuggestions: SuggestionData[];
	onAdd: (text: string[], focusInput: boolean) => Promise<void> | void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	reverse?: boolean;
}) {
	const isSubscribed = useHasServerAccess();

	const menuId = useId();
	const inputId = useId();

	const [addingRecipe, setAddingRecipe] = useState<Recipe | null>(null);
	const clearAddingRecipe = useCallback(() => {
		setAddingRecipe(null);
	}, []);

	const [inputValue, setInputValue] = useState('');
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	const clear = useCallback(() => {
		setInputValue('');
		setSuggestionPrompt('');
		setHighlightedIndex(-1);
	}, [setSuggestionPrompt]);

	const selectItem = useCallback(
		async (selected: SuggestionData, focusInput: boolean) => {
			if (selected.type === 'food') {
				try {
					const { quantity } = destructureSearchPrompt(inputValue || '');
					if (quantity) {
						await onAdd([`${quantity} ${selected.name}`], focusInput);
					} else {
						await onAdd([selected.name], focusInput);
					}
				} catch {
					setInputValue(inputValue || '');
				}
			} else if (selected.type === 'recipe') {
				setAddingRecipe(selected.recipe);
			} else {
				await onAdd([suggestionToString(selected)], focusInput);
			}
		},
		[onAdd, inputValue],
	);

	const selectInputValue = useCallback(() => {
		if (isUrl(inputValue)) {
			if (isSubscribed) {
				recipeSavePromptState.url = inputValue;
			} else {
				showSubscriptionPromotion();
			}
		} else {
			onAdd([inputValue], true);
		}
	}, [inputValue, onAdd, isSubscribed]);

	const maxIndex = allSuggestions.length - 1;
	const onInputKeyDown = useCallback(
		async (ev: KeyboardEvent) => {
			switch (ev.key) {
				case 'ArrowDown':
					if (reverse) {
						setHighlightedIndex((index) => (index + maxIndex) % (maxIndex + 1));
					} else {
						setHighlightedIndex((index) => (index + 1) % (maxIndex + 1));
					}
					onOpenChange?.(true);
					break;
				case 'ArrowUp':
					if (reverse) {
						setHighlightedIndex((index) => (index + 1) % (maxIndex + 1));
					} else {
						setHighlightedIndex((index) => (index + maxIndex) % (maxIndex + 1));
					}
					break;
				case 'Enter':
					if (highlightedIndex >= 0 && allSuggestions[highlightedIndex]) {
						const selected = allSuggestions[highlightedIndex];
						await selectItem(selected, true);
					} else {
						selectInputValue();
					}
					clear();
					break;
				case 'Escape':
					clear();
					onOpenChange?.(false);
					break;
			}
		},
		[
			maxIndex,
			highlightedIndex,
			allSuggestions,
			clear,
			selectItem,
			selectInputValue,
			onOpenChange,
			reverse,
		],
	);

	const onInputPaste = useCallback(
		async (event: React.ClipboardEvent<HTMLInputElement>) => {
			// check for multi-line paste or URL paste
			const text = event.clipboardData.getData('text/plain');
			const lines = text.split(/\r?\n/).map((t) => t.trim());
			const items = lines.filter(Boolean);
			if (items.length > 1) {
				await onAdd(items, true);
				setInputValue('');
				setSuggestionPrompt('');
			}
		},
		[onAdd, setSuggestionPrompt],
	);

	const getInputProps = (rest: any): ComponentProps<'input'> => {
		return {
			...rest,
			onKeyDown: onInputKeyDown,
			onPaste: onInputPaste,
			onChange: (ev) => {
				setInputValue(ev.target.value);
				startTransition(() => {
					setSuggestionPrompt(ev.target.value);
				});
			},
			id: inputId,
			'aria-autocomplete': 'list',
			'aria-controls': menuId,
			'aria-activedescendant': allSuggestions[highlightedIndex]?.id,
			'aria-expanded': open,
			value: inputValue,
			autoComplete: 'off',
			autoCorrect: 'off',
			autoCapitalize: 'off',
			spellCheck: false,
		};
	};

	const ref = useOnPointerDownOutside((ev) => {
		if ((ev.target as HTMLElement).id === inputId) return;
		onOpenChange?.(false);
	});
	const getMenuProps = useCallback(
		(rest: any) => ({
			id: menuId,
			role: 'listbox',
			'aria-labelledby': inputId,
			ref,
			...rest,
		}),
		[menuId, inputId, ref],
	);

	const getItemProps = useCallback(
		({ item }: { item: SuggestionData }) => {
			return {
				id: item.id,
				role: 'option',
				'aria-selected': item.index === highlightedIndex,
				onClick: () => {
					selectItem(item, false);
					clear();
				},
			};
		},
		[highlightedIndex, selectItem, clear],
	);

	const getSubmitButtonProps = useCallback(
		() => ({
			onClick: () => {
				if (isUrl(inputValue)) {
					if (isSubscribed) {
						recipeSavePromptState.url = inputValue;
					} else {
						showSubscriptionPromotion();
					}
				} else {
					onAdd([inputValue], true);
				}
				clear();
			},
		}),
		[inputValue, onAdd, clear, isSubscribed],
	);

	return {
		setAddingRecipe,
		clearAddingRecipe,
		addingRecipe,
		getInputProps,
		getItemProps,
		getMenuProps,
		getSubmitButtonProps,
		clear,
	};
}

export function useKeepOpenAfterSelect() {
	return useLocalStorage('addBar_keepOpenAfterSelect', false);
}
