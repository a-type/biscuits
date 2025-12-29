import { pickBestNameMatch } from '@/components/foods/lookup.jsx';
import { groceriesState } from '@/components/groceries/state.js';
import { RECIPE_PINNED_CUTOFF } from '@/components/recipes/constants.js';
import { toast } from '@a-type/ui';
import { graphqlClient } from '@biscuits/graphql';
import { depluralize, parseIngredient } from '@gnocchi.biscuits/conversion';
import {
	Client,
	Food,
	Item,
	ItemDestructured,
	ItemInit,
	ItemInputsItemInit,
	Recipe,
	RecipeIngredients,
	RecipeIngredientsItemInit,
	RecipeIngredientsItemSnapshot,
	RecipeInit,
} from '@gnocchi.biscuits/verdant';
import { useSearchParams } from '@verdant-web/react-router';
import cuid from 'cuid';
import pluralize from 'pluralize';
import { useCallback } from 'react';
import {
	defaultCategoriesQuery,
	foodAssignMutation,
	foodLookupQuery,
	hooks,
	Presence,
	Profile,
} from './index.js';
import { getScannedRecipe } from './scanRecipe.js';

export function useDeleteItem() {
	const client = hooks.useClient();
	return useCallback(
		async (item: Item) => {
			await client.items.delete(item.get('id'));
			client.sync.presence.update({
				lastInteractedItem: item.get('id'),
				lastInteractedCategory: item.get('categoryId') ?? null,
			});
		},
		[client],
	);
}

export function useDeleteItems() {
	const client = hooks.useClient();
	return useCallback((ids: string[]) => client.items.deleteAll(ids), [client]);
}

export function useUpsertFoodCategoryAssignment() {
	const client = hooks.useClient();
	return useCallback(
		async (food: string, categoryId: string | null) => {
			// send the categorization to the server for research
			if (categoryId) {
				try {
					await graphqlClient.mutate({
						mutation: foodAssignMutation,
						variables: {
							input: {
								foodName: food,
								categoryId,
							},
						},
						context: {
							hideErrors: true,
						},
					});
				} catch (err) {
					console.error(err);
				}
			}

			const existing = await client.foods.findOne({
				index: {
					where: 'nameLookup',
					equals: food,
				},
			}).resolved;
			if (existing) {
				if (categoryId) {
					client
						.batch({ undoable: false })
						.run(() => {
							existing.set('categoryId', categoryId);
						})
						.commit();
				}
			} else if (categoryId) {
				try {
					const remoteLookup = await graphqlClient.query({
						query: foodLookupQuery,
						variables: {
							food,
						},
						context: {
							hideErrors: true,
						},
					});
					if (remoteLookup?.data?.food) {
						await client.foods.put(
							{
								canonicalName: remoteLookup.data.food.canonicalName,
								categoryId,
								alternateNames: remoteLookup.data.food.alternateNames,
							},
							{ undoable: false },
						);
					}
				} catch (err) {
					console.error(err);
				}
			}
		},
		[client],
	);
}

export function useToggleItemPurchased() {
	const client = hooks.useClient();
	return useCallback(
		async (item: Item) => {
			if (item.get('purchasedAt')) {
				item.set('purchasedAt', null);
			} else {
				await purchaseItem(client, item);
			}
			client.sync.presence.update({
				lastInteractedItem: item.get('id'),
				lastInteractedCategory: item.get('categoryId') ?? null,
			});
		},
		[client],
	);
}

export function usePurchaseItem() {
	const client = hooks.useClient();
	return useCallback(
		(item: Item, batchName?: string) => purchaseItem(client, item, batchName),
		[client],
	);
}

export function usePurchaseItems() {
	const purchaseItem = usePurchaseItem();
	const client = hooks.useClient();
	return useCallback(
		async (items: Item[]) => {
			const batchName = cuid();
			const batch = client.batch({
				batchName,
				timeout: null,
				max: null,
			});
			await Promise.all(items.map((item) => purchaseItem(item, batchName)));
			batch.flush();
		},
		[client],
	);
}

export function useUpdateItem() {
	const client = hooks.useClient();
	return useCallback(
		async (item: Item, updates: Omit<Partial<ItemDestructured>, 'inputs'>) => {
			item.update(updates);
			client.sync.presence.update({
				lastInteractedItem: item.get('id'),
				lastInteractedCategory: item.get('categoryId'),
			});
		},
		[client],
	);
}

export function useSetItemCategory() {
	const client = hooks.useClient();
	const upsertFoodCategoryAssignment = useUpsertFoodCategoryAssignment();
	return useCallback(
		async (item: Item, categoryId: string | null, updateAssignment = false) => {
			item.set('categoryId', categoryId);
			if (updateAssignment) {
				await upsertFoodCategoryAssignment(item.get('food'), categoryId);
			}
			client.sync.presence.update({
				lastInteractedItem: item.get('id'),
				lastInteractedCategory: categoryId,
			});
		},
		[client],
	);
}

export function useCreateCategory() {
	const client = hooks.useClient();
	return useCallback(
		async (name: string) => {
			return client.categories.put({
				name,
			});
		},
		[client],
	);
}

export function useResetCategoriesToDefault() {
	const client = hooks.useClient();
	return useCallback(async () => {
		const defaultCategories =
			(
				await graphqlClient.query({
					query: defaultCategoriesQuery,
					context: { hideErrors: true },
				})
			)?.data?.categories ?? [];
		const existingCategories = await client.categories.findAll().resolved;
		const existingIdsToDelete = existingCategories
			.map((cat) => cat.get('id'))
			.filter((id) => !defaultCategories.find((cat) => cat.id === id));
		await client.categories.deleteAll(existingIdsToDelete);
		for (const cat of defaultCategories) {
			await client.categories.put({
				id: cat.id.toString(),
				name: cat.name,
				sortKey: cat.sortKey,
			});
		}
	}, [client]);
}

export function useAddItems() {
	const client = hooks.useClient();
	return useCallback(
		async (
			lines: (
				| string
				| {
						original: string;
						quantity: number;
						unit: string | null;
						food: string;
						textOverride?: string;
				  }
			)[],
			data: {
				listId?: string | null;
				sourceInfo?: Omit<ItemInputsItemInit, 'text' | 'quantity'>;
				purchased?: boolean;
				showToast?: boolean;
			} = {},
		) => {
			return addItems(client, lines, data);
		},
		[client],
	);
}

export function useCloneItem() {
	const client = hooks.useClient();
	return useCallback(
		async (item: Item) => {
			const { id, purchasedAt, ...snapshot } = item.getSnapshot();
			// make a clone of the remaining data
			const clone = JSON.parse(JSON.stringify(snapshot));
			const newItem = await client.items.put(clone);
			return newItem;
		},
		[client],
	);
}

export function useAddIngredients() {
	const client = hooks.useClient();
	return useCallback(
		async (
			ingredients: RecipeIngredientsItemSnapshot[],
			{
				recipeId,
				multiplier = 1,
				showToast,
				listId,
				title,
			}: {
				recipeId: string;
				multiplier?: number;
				showToast?: boolean;
				listId?: string | null;
				title?: string | null;
			},
		) => {
			const processed = await Promise.all(
				ingredients.map(async (ingredient) => {
					const totalQuantity = ingredient.quantity * (multiplier || 1);
					const foodName = ingredient.food;
					const food = foodName
						? pickBestNameMatch(
								await client.foods.findAll({
									index: {
										where: 'nameLookup',
										equals: foodName,
									},
								}).resolved,
								foodName,
						  )
						: undefined;
					const unit = ingredient.unit;
					const textOverride =
						multiplier !== 1
							? `${totalQuantity} ${
									unit ? pluralize(unit, totalQuantity) : ''
							  } ${
									food
										? food.get('pluralizeName')
											? pluralize(food.get('canonicalName'))
											: food.get('canonicalName')
										: foodName ?? ''
							  }`
							: food
							? food.get('pluralizeName')
								? pluralize(food.get('canonicalName'))
								: food.get('canonicalName')
							: foodName ?? undefined;

					return {
						original: ingredient.text,
						quantity: textOverride ? 1 : totalQuantity,
						unit: unit,
						food: ingredient.food || 'Unknown',
						// for items added from this view, we add the food
						// name as the text, not the ingredient text
						textOverride,
					};
				}),
			);
			return addItems(client, processed, {
				sourceInfo: {
					multiplier: multiplier !== 1 ? multiplier : undefined,
					recipeId,
					title,
				},
				listId,
				showToast,
			});
		},
		[client],
	);
}

export function useDeleteCategory() {
	const client = hooks.useClient();
	return useCallback(
		async (categoryId: string) => {
			const matchingItems = await client.items.findAll({
				index: {
					where: 'categoryId',
					equals: categoryId,
				},
			}).resolved;
			// move all items to the default category
			for (const item of matchingItems) {
				item.set('categoryId', null);
			}
			// delete all lookups for this category locally
			const lookups = await client.foods.findAll({
				index: {
					where: 'categoryId',
					equals: categoryId,
				},
			}).resolved;
			for (const lookup of lookups) {
				lookup.set('categoryId', null);
			}

			client.categories.delete(categoryId);
		},
		[client],
	);
}

export function useDeleteList() {
	const client = hooks.useClient();
	return useCallback(
		async (listId: string) => {
			const matchingItems = await client.items.findAll({
				index: {
					where: 'listId',
					equals: listId,
				},
			}).resolved;
			for (const item of matchingItems) {
				item.set('listId', null);
			}
			await client.lists.delete(listId);
		},
		[client],
	);
}

export function useDeleteRecipe() {
	const client = hooks.useClient();
	return useCallback(
		async (recipeId: string) => {
			await client.recipes.delete(recipeId);
		},
		[client],
	);
}

export function useAddRecipeFromUrl() {
	const client = hooks.useClient();
	return useCallback(
		async (url: string) => {
			const scanned = await getScannedRecipe({ url }, client);
			const recipe = await client.recipes.put(scanned);
			return recipe;
		},
		[client],
	);
}

export function useAddRecipeFromSlug() {
	const client = hooks.useClient();
	return useCallback(
		async (slug: string) => {
			const scanned = await getScannedRecipe(
				{ publicRecipeSlug: slug },
				client,
			);
			const recipe = await client.recipes.put(scanned);
			return recipe;
		},
		[client],
	);
}

export function useUpdateRecipeFromUrl() {
	const client = hooks.useClient();
	return useCallback(
		async (recipe: Recipe, url: string) => {
			const { instructions, ...scanned } = await getScannedRecipe(
				{ url },
				client,
			);
			const copyWithoutUndefined = Object.entries(scanned)
				.filter(([_, v]) => v !== undefined)
				.reduce((acc, [k, v]) => {
					acc[k as keyof RecipeInit] = v;
					return acc;
				}, {} as any);
			recipe.update(copyWithoutUndefined);

			// set this separately - do not merge
			if (instructions) {
				recipe.set('instructions', instructions);
			}
		},
		[client],
	);
}

export function useAddRecipeIngredients() {
	const client = hooks.useClient();
	return useCallback(
		async (ingredients: RecipeIngredients, text: string) => {
			const lines = text.split('\n');
			const parsed = await Promise.all(
				lines
					.filter((line) => line.trim().length > 0)
					.map(async (line): Promise<RecipeIngredientsItemInit> => {
						const parsedItem = parseIngredient(line);
						let food = parsedItem.food;
						if (food) {
							// attempt to find a matching food
							try {
								const lookups = await client.foods.findAll({
									index: {
										where: 'nameLookup',
										equals: parsedItem.food,
									},
								}).resolved;
								const best = pickBestNameMatch(lookups, parsedItem.food, true);
								if (best) {
									food = best.get('canonicalName');
								}
							} catch (err) {
								// ignore
							}
						}
						return {
							text: line,
							food,
							comments: parsedItem.comments,
							quantity: parsedItem.quantity,
							unit: parsedItem.unit,
							isSectionHeader: parsedItem.isSectionHeader,
						};
					}),
			);
			for (const item of parsed) {
				ingredients.push(item);
			}
		},
		[client],
	);
}

export function useAddPantryItem() {
	const client = hooks.useClient();
	return useCallback(
		async (foodName: string) => {
			foodName = depluralize(foodName).toLowerCase();
			const firstWord = foodName.split(' ')[0];
			const possibleMatches = await client.foods.findAll({
				index: {
					where: 'nameLookup',
					equals: firstWord,
				},
			}).resolved;
			const food = pickBestNameMatch(possibleMatches, foodName, true);
			if (food) {
				const now = Date.now();
				food.set('lastPurchasedAt', now);
				food.set('inInventory', true);
				const expiry = food.get('expiresAfterDays');
				if (expiry) {
					food.set('expiresAt', now + expiry * 24 * 60 * 60 * 1000);
				}
			} else {
				await client.foods.put({
					canonicalName: foodName,
					lastPurchasedAt: Date.now(),
					purchaseCount: 1,
					inInventory: true,
				});
			}
		},
		[client],
	);
}

export function useClearPantryItem() {
	const client = hooks.useClient();
	return useCallback(
		async (food: Food) => {
			food.update({
				inInventory: false,
				expiresAt: null,
				frozenAt: null,
			});
			// add the item to the list if it's a staple
			if (food.get('isStaple')) {
				const shouldPluralize = food.get('pluralizeName');
				await addItems(
					client,
					[pluralize(food.get('canonicalName'), shouldPluralize ? 2 : 1)],
					{
						showToast: true,
						listId: food.get('defaultListId'),
						onlyIfNotPresent: true,
						toastMessage: (name) =>
							`Staple food "${pluralize(
								name,
								food.get('pluralizeName') ? 2 : 1,
							)}" put back on the list!`,
					},
				);
			}
		},
		[client],
	);
}

export function useChangeFoodCanonicalName() {
	const client = hooks.useClient();
	const [params, setParams] = useSearchParams();
	const showFood = params.get('showFood');
	return useCallback(
		async (food: Food, newName: string) => {
			newName = newName.toLowerCase();
			if (food.get('canonicalName') === newName) return;

			const existing = await client.foods.findOne({
				index: {
					where: 'anyName',
					equals: newName,
				},
			}).resolved;

			let finalCanonicalName: string = newName;

			if (existing && existing !== food) {
				// confirm merge
				if (
					!confirm(
						`You already have a food named ${newName}. Merge "${food.get(
							'canonicalName',
						)}" with "${existing.get('canonicalName')}"?`,
					)
				) {
					return;
				}

				// merge - this is not undoable since delete can't be batched with the rest...
				client
					.batch({ undoable: false, max: null })
					.run(() => {
						existing.get('alternateNames').add(food.get('canonicalName'));
						for (const altName of food.get('alternateNames')) {
							existing.get('alternateNames').add(altName);
						}
					})
					.commit();
				await client.foods.delete(food.get('canonicalName'));

				toast.success('Merged foods');

				finalCanonicalName = existing.get('canonicalName');
			} else {
				// create a new food, delete the old
				await client.foods.put({
					...food.getSnapshot(),
					canonicalName: newName,
					alternateNames: food
						.get('alternateNames')
						.getSnapshot()
						.concat(food.get('canonicalName')),
				});
				await client.foods.delete(food.get('canonicalName'));
				finalCanonicalName = newName;
			}

			// if currently viewing the food (probably are) then redirect

			if (showFood === food.get('canonicalName')) {
				setParams((p) => {
					p.set('showFood', finalCanonicalName);
					return p;
				});
			}
		},
		[client, showFood, setParams],
	);
}

export async function addItems(
	client: Client,
	lines: (
		| string
		| {
				original: string;
				quantity: number;
				unit: string | null;
				food: string;
				textOverride?: string;
		  }
	)[],
	{
		sourceInfo,
		listId = null,
		purchased,
		showToast,
		onlyIfNotPresent,
		toastMessage,
	}: {
		listId?: string | null;
		sourceInfo?: Omit<ItemInputsItemInit, 'text' | 'quantity'>;
		purchased?: boolean;
		showToast?: boolean;
		toastMessage?: (name: string) => string;
		onlyIfNotPresent?: boolean;
	},
) {
	if (!lines.length) return;

	const purchasedAt = purchased ? Date.now() : undefined;

	const results = await Promise.allSettled(
		lines.map(async (line) => {
			if (typeof line === 'string' && !line.trim()) return;
			const parsed = typeof line === 'string' ? parseIngredient(line) : line;
			const firstMatch = await client.items.findOne({
				index: {
					where: 'purchased_food_listId',
					match: {
						purchased: 'no',
						food: parsed.food,
						listId: listId || 'null',
					},
					order: 'asc',
				},
			}).resolved;
			if (firstMatch && !purchased) {
				// skip increasing existing matched item if this flag is set
				if (!onlyIfNotPresent) {
					const totalQuantity =
						firstMatch.get('totalQuantity') + parsed.quantity;
					firstMatch.set('totalQuantity', totalQuantity);
					// add the source, too
					const inputs = firstMatch.get('inputs');
					inputs.push({
						...sourceInfo,
						text: parsed.original,
					});
				}
			} else {
				const lookup = await client.foods.findOne({
					index: {
						where: 'anyName',
						equals: parsed.food,
					},
				}).resolved;
				let categoryId: string | null = lookup?.get('categoryId') ?? null;

				if (lookup) {
					client.batch({ undoable: false }).run(() => {
						lookup.set('lastAddedAt', Date.now());
					});
				}

				// verify the category exists locally
				const category = categoryId
					? await client.categories.get(categoryId).resolved
					: null;
				if (!category) {
					categoryId = null;
				}

				const textOverride =
					typeof line === 'string' ? undefined : line.textOverride;

				let item: Item;

				const baseItemData: ItemInit = {
					listId: listId || lookup?.get('defaultListId') || null,
					createdAt: Date.now(),
					totalQuantity: parsed.quantity,
					unit: parsed.unit || '',
					food: parsed.food,
					purchasedAt,
					inputs: [
						{
							...sourceInfo,
							text: parsed.original,
							quantity: parsed.quantity,
						},
					],
					textOverride,
				};

				if (!categoryId && navigator.onLine) {
					// race between a timeout and fetching food metadata... don't block adding the item too long if offline,
					// but attempt to prevent a pop-in of remote data changes

					const createItemPromise = new Promise((resolve) =>
						setTimeout(resolve, 200),
					).then(() => {
						return client.items.put({
							categoryId,
							...baseItemData,
						});
					});

					// in parallel, attempt to get the food data

					async function lookupFoodFromApi() {
						let remoteLookup: {
							id: string | number;
							canonicalName: string;
							alternateNames: string[];
							category: { id: string | number } | null;
						} | null = null;
						try {
							remoteLookup =
								(
									await graphqlClient.query({
										query: foodLookupQuery,
										variables: {
											food: parsed.food,
										},
										context: {
											hideErrors: true,
										},
									})
								).data?.food ?? null;
						} catch (err) {
							console.error('Failed to lookup food', err);
						}
						if (remoteLookup) {
							await client.foods.put({
								canonicalName: remoteLookup.canonicalName,
								categoryId: remoteLookup.category?.id.toString(),
								alternateNames: remoteLookup.alternateNames,
								lastAddedAt: Date.now(),
								defaultListId: baseItemData.listId,
							});
							// verify the category exists locally
							const category = remoteLookup.category?.id
								? await client.categories.get(
										remoteLookup.category?.id.toString(),
								  ).resolved
								: null;

							if (category) {
								// now find the item we created and update it. this is not undoable since it was not
								// user-initiated.
								if (item) {
									client.batch({ undoable: false }).run(() => {
										item.set(
											'categoryId',
											remoteLookup?.category?.id.toString(),
										);
									});
								}
								categoryId = remoteLookup.category?.id.toString() ?? null;
							}
						} else if (!lookup) {
							await client.foods.put({
								canonicalName: parsed.food,
								categoryId: null,
								alternateNames: [],
								lastAddedAt: Date.now(),
								purchaseCount: 1,
								defaultListId: baseItemData.listId,
							});
						}
					}

					// if this promise chain resolves before the other one, the categoryId variable will be
					// set and the item will be created with the correct category.
					// if it doesn't resolve first, the "if (item)" branch above will be taken and
					// the existing item will be updated.
					lookupFoodFromApi();
					item = await createItemPromise;
				} else {
					item = await client.items.put({
						categoryId,
						...baseItemData,
					});
				}
			}
		}),
	);

	const lastItemId =
		results
			.reverse()
			.find((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
			?.value?.get('id') ?? null;

	const recipeId = sourceInfo?.recipeId;

	if (recipeId) {
		// record usage for this recipe
		const recipe = await client.recipes.get(recipeId).resolved;
		if (recipe) {
			client.batch({ undoable: false }).run(() => {
				const previousAddedAt = recipe.get('lastAddedAt');
				if (previousAddedAt) {
					const interval = Date.now() - previousAddedAt;
					const currentGuess = recipe.get('addIntervalGuess');

					// reject outliers... if we've established a baseline
					if (
						!currentGuess ||
						(interval <= currentGuess * 2 && interval >= currentGuess / 2)
					) {
						const newGuess = Math.max(
							((currentGuess ?? 0) + interval) / 2,
							1000 * 60 * 60 * 24 * 7, // 1 week
						);
						recipe.set('addIntervalGuess', newGuess);
					}
				}

				recipe.set('lastAddedAt', Date.now());
			});
		}
	}

	if (lastItemId) {
		client.sync.presence.update({
			lastInteractedItem: lastItemId,
		});
	}

	if (showToast) {
		let message;
		if (lines.length === 1) {
			if (toastMessage) {
				const name = typeof lines[0] === 'string' ? lines[0] : lines[0].food;
				message = toastMessage(name);
			} else {
				const line = lines[0];
				if (typeof line === 'string') {
					message = 'Added ' + line;
				} else {
					message = 'Added ' + line.textOverride || line.food;
				}
			}
		} else {
			message = 'Added ' + lines.length + ' items';
		}

		const recipe = recipeId
			? await client.recipes.get(recipeId).resolved
			: null;
		const recipePinnedAt = recipe?.get('pinnedAt');

		const toastId = toast.success(message, {
			timeout: recipe ? 5000 : 2000,
			data:
				recipe && (!recipePinnedAt || recipePinnedAt < RECIPE_PINNED_CUTOFF)
					? {
							actions: [
								{
									label: 'Pin recipe',
									onClick: async () => {
										recipe.set('pinnedAt', Date.now());
										toast.update(toastId, 'Recipe pinned', {
											data: {},
											type: 'success',
											timeout: 2000,
										});
									},
								},
							],
					  }
					: undefined,
		});
	}
	groceriesState.justAddedSomething = true;
	console.log(`Added items: ${lines.length}`);
}

export async function purchaseItem(
	client: Client<Presence, Profile>,
	item: Item,
	batchName?: string,
) {
	// also set expiration based on food info
	const food = await client.foods.findOne({
		index: {
			where: 'anyName',
			equals: item.get('food'),
		},
	}).resolved;
	const categoryId = item.get('categoryId');
	const category = categoryId
		? await client.categories.get(categoryId).resolved
		: null;

	const now = Date.now();

	client.batch({ batchName }).run(() => {
		item.set('purchasedAt', now);

		if (food) {
			const expiresAfterDays = food.get('expiresAfterDays');
			if (expiresAfterDays) {
				food.set('expiresAt', now + expiresAfterDays * 24 * 60 * 60 * 1000);
			}
			const previousPurchaseCount = food.get('purchaseCount');
			const previousPurchasedAt = food.get('lastPurchasedAt');
			food.set('lastPurchasedAt', now);
			food.set('inInventory', true);
			const currentGuess = food.get('purchaseIntervalGuess') || 0;
			if (previousPurchasedAt) {
				const newInterval = now - previousPurchasedAt;
				// reject outliers ... if we've established a baseline
				if (
					previousPurchaseCount < 5 ||
					(newInterval <= 4 * currentGuess && newInterval >= currentGuess / 4)
				) {
					// minium 1 week
					const newGuess = Math.max(
						(currentGuess + newInterval) / 2,
						7 * 24 * 60 * 60 * 1000,
					);
					food.set('purchaseIntervalGuess', newGuess);
				}
			}
			food.set('purchaseCount', previousPurchaseCount + 1);
		}

		// auto freeze items from the frozen section
		if (category?.get('name').toLowerCase().startsWith('frozen')) {
			food?.set('frozenAt', now);
		}
	});

	if (!food) {
		// TODO: make this a part of the batch above
		await client.foods.put({
			canonicalName: item.get('food'),
			categoryId: item.get('categoryId'),
			alternateNames: [],
			lastPurchasedAt: Date.now(),
			lastAddedAt: item.get('createdAt'),
			purchaseCount: 1,
			defaultListId: item.get('listId'),
			inInventory: true,
		});
	}

	client.sync.presence.update({
		lastInteractedItem: item.get('id'),
		lastInteractedCategory: item.get('categoryId') ?? null,
	});
}
