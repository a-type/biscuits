import { pickBestNameMatch } from '@/components/foods/lookup.jsx';
import { groceriesState } from '@/components/groceries/state.js';
import { graphql, graphqlClient } from '@biscuits/graphql';
import { getVerdantSync, VerdantContext } from '@biscuits/client';
import { parseIngredient } from '@gnocchi.biscuits/conversion';
import { depluralize } from '@gnocchi.biscuits/conversion';
import {
	Client,
	ClientDescriptor,
	Food,
	Item,
	ItemDestructured,
	ItemInit,
	ItemInputsItemInit,
	Recipe,
	RecipeIngredients,
	RecipeIngredientsItemInit,
	RecipeInit,
	UserInfo,
	createHooks,
	migrations,
} from '@gnocchi.biscuits/verdant';
import { useSearchParams } from '@verdant-web/react-router';
import cuid from 'cuid';
import pluralize from 'pluralize';
import { useCallback } from 'react';
import { toast } from '@a-type/ui';
import { getScannedRecipe } from './scanRecipe.js';

export interface Presence {
	lastInteractedItem: string | null;
	viewingRecipeId: string | null;
	lastInteractedCategory: string | null;
}

export interface Profile {
	id: string;
	name: string;
	imageUrl?: string;
}

export type Person = UserInfo<Profile, Presence>;

const foodLookupQuery = graphql(`
	query FoodLookup($food: String!) {
		food(name: $food) {
			id
			canonicalName
			alternateNames
			category {
				id
			}
		}
	}
`);

const foodAssignMutation = graphql(`
	mutation AssignFoodCategory($input: AssignFoodCategoryInput!) {
		assignFoodCategory(input: $input) {
			food {
				id
			}
		}
	}
`);

const defaultCategoriesQuery = graphql(`
	query DefaultCategories {
		categories: foodCategories {
			id
			name
			sortKey
		}
	}
`);

export const hooks = createHooks<Presence, Profile>({
	Context: VerdantContext,
}).withMutations({
	useDeleteItem: (client) => {
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
	},
	useDeleteItems: (client) =>
		useCallback((ids: string[]) => client.items.deleteAll(ids), [client]),
	useUpsertFoodCategoryAssignment: (client) =>
		useCallback(
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
		),
	useToggleItemPurchased: (client) => {
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
	},
	usePurchaseItem: (client) =>
		useCallback(
			(item: Item, batchName?: string) => purchaseItem(client, item, batchName),
			[client],
		),
	usePurchaseItems: (client) => {
		const purchaseItem = hooks.usePurchaseItem();
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
	},
	useUpdateItem: (client) =>
		useCallback(
			async (
				item: Item,
				updates: Omit<Partial<ItemDestructured>, 'inputs'>,
			) => {
				item.update(updates);
				client.sync.presence.update({
					lastInteractedItem: item.get('id'),
					lastInteractedCategory: item.get('categoryId'),
				});
			},
			[client],
		),
	useSetItemCategory: (client) => {
		const upsertFoodCategoryAssignment =
			hooks.useUpsertFoodCategoryAssignment();
		return useCallback(
			async (
				item: Item,
				categoryId: string | null,
				updateAssignment = false,
			) => {
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
	},
	useCreateCategory: (client) =>
		useCallback(
			async (name: string) => {
				return client.categories.put({
					name,
				});
			},
			[client],
		),
	useResetCategoriesToDefault: (client) =>
		useCallback(async () => {
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
		}, [client]),
	useAddItems: (client) =>
		useCallback(
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
		),
	useCloneItem: (client) =>
		useCallback(
			async (item: Item) => {
				const { id, purchasedAt, ...snapshot } = item.getSnapshot();
				// make a clone of the remaining data
				const clone = JSON.parse(JSON.stringify(snapshot));
				const newItem = await client.items.put(clone);
				return newItem;
			},
			[client],
		),
	useDeleteCategory: (client) =>
		useCallback(
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
		),
	useDeleteList: (client) =>
		useCallback(
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
		),
	useDeleteRecipe: (client) =>
		useCallback(
			async (recipeId: string) => {
				await client.recipes.delete(recipeId);
			},
			[client],
		),

	/** Recipes */
	useAddRecipeFromUrl: (client) =>
		useCallback(
			async (url: string) => {
				const scanned = await getScannedRecipe(url, client);
				const recipe = await client.recipes.put(scanned);
				return recipe;
			},
			[client],
		),

	useUpdateRecipeFromUrl: (client) =>
		useCallback(
			async (recipe: Recipe, url: string) => {
				const { instructions, ...scanned } = await getScannedRecipe(
					url,
					client,
				);
				// FIXME: verdant will have a fix for this soon
				let copyWithoutUndefined = Object.entries(scanned)
					.filter(([_, v]) => v !== undefined)
					.reduce((acc, [k, v]) => {
						acc[k as keyof RecipeInit] = v;
						return acc;
					}, {} as Partial<RecipeInit>);
				recipe.update(copyWithoutUndefined);

				// set this separately - do not merge
				if (instructions) {
					recipe.set('instructions', instructions);
				}
			},
			[client],
		),

	useAddRecipeIngredients: (client) =>
		useCallback(
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
									const lookup = await client.foods.findOne({
										index: {
											where: 'nameLookup',
											equals: parsedItem.food,
										},
									}).resolved;
									if (lookup) {
										food = lookup.get('canonicalName');
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
		),
	useAddPantryItem: (client) =>
		useCallback(
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
		),

	useClearPantryItem: (client) =>
		useCallback(async (food: Food) => {
			food.update({
				inInventory: false,
				expiresAt: null,
				frozenAt: null,
			});
		}, []),

	useChangeFoodCanonicalName: (client) => {
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
	},
});

const DEBUG = localStorage.getItem('DEBUG') === 'true';
const NO_SYNC = window.location.search.includes('nosync');
export function createClientDescriptor(options: { namespace: string }) {
	return new ClientDescriptor({
		sync: NO_SYNC
			? undefined
			: getVerdantSync({
					appId: 'gnocchi',
					initialPresence: {
						lastInteractedItem: null,
						viewingRecipeId: null,
						lastInteractedCategory: null,
					} satisfies Presence,
					access: 'members',
			  }),
		migrations,
		namespace: options.namespace,
		log:
			import.meta.env.DEV || DEBUG
				? (level, ...args: any[]) => {
						if (level === 'debug') {
							if (DEBUG) {
								console.debug('🌿', ...args);
							}
						} else if (level === 'error' || level === 'critical') {
							console.error('🌿', ...args);
						} else if (level === 'warn') {
							console.warn('🌿', ...args);
						} else {
							console.debug('🌿', ...args);
						}
				  }
				: undefined,
		EXPERIMENTAL_weakRefs: true,
	});
}

export const groceriesDescriptor = createClientDescriptor({
	namespace: 'groceries',
});
(window as any).groceriesDescriptor = groceriesDescriptor;
const _groceries = groceriesDescriptor.open();

(window as any).stats = async () => {
	(await _groceries).stats().then(console.info);
};
_groceries.then((g) => {
	(window as any).groceries = g;
});

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
	}: {
		listId?: string | null;
		sourceInfo?: Omit<ItemInputsItemInit, 'text' | 'quantity'>;
		purchased?: boolean;
		showToast?: boolean;
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
				const totalQuantity = firstMatch.get('totalQuantity') + parsed.quantity;
				firstMatch.set('totalQuantity', totalQuantity);
				// add the source, too
				const inputs = firstMatch.get('inputs');
				inputs.push({
					...sourceInfo,
					text: parsed.original,
				});
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

	if (sourceInfo?.recipeId) {
		// record usage for this recipe
		const recipe = await client.recipes.get(sourceInfo.recipeId).resolved;
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
		toast.success(
			'Added ' + lines.length + ' ' + pluralize('item', lines.length),
			{
				id: 'add-items',
			},
		);
		groceriesState.justAddedSomething = true;
	}
}

async function purchaseItem(client: Client, item: Item, batchName?: string) {
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

// hook up undo to ctrl+z
document.addEventListener('keydown', async (e) => {
	if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
		e.preventDefault();
		const result = await (await _groceries).undoHistory.undo();
		if (!result) {
			console.log('Nothing to undo');
		}
	}
	if (
		(e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
		(e.key === 'z' && e.shiftKey && (e.ctrlKey || e.metaKey))
	) {
		e.preventDefault();
		const result = await (await _groceries).undoHistory.redo();
		if (!result) {
			console.log('Nothing to redo');
		}
	}
});

// startup tasks
_groceries.then(async (g) => {
	// delete any purchased items older than 1 year
	const purchased = await g.items.findAll({
		index: {
			where: 'purchased',
			equals: 'yes',
		},
	}).resolved;
	const now = Date.now();
	const itemsToDelete = purchased
		.filter((item) => {
			const purchasedAt = item.get('purchasedAt');
			return purchasedAt && purchasedAt < now - 365 * 24 * 60 * 60 * 1000;
		})
		.map((i) => i.get('id'));
	await g.items.deleteAll(itemsToDelete);

	const backup = await import('@verdant-web/store/backup');
	backup.transferOrigins(
		g,
		'https://gnocchi.club',
		'https://gnocchi.biscuits.club',
	);
	backup.transferOrigins(g, 'http://localhost:6299', 'http://localhost:6220');
});
