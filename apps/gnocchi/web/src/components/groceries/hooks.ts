import { hooks } from '@/stores/groceries/index.js';
import { Category, Item } from '@gnocchi.biscuits/verdant';
import { useEffect, useMemo, useState } from 'react';
import { useSnapshot } from 'valtio';
import { groceriesState } from './state.js';

export function useItemsGroupedAndSorted(
	listId: string | null | undefined = undefined,
) {
	const items = hooks.useAllItems(
		listId === undefined
			? undefined
			: {
					index: {
						where: 'listId',
						equals: listId,
					},
			  },
	);
	const categories = hooks.useAllCategories();
	const { purchasedThisSession } = useSnapshot(groceriesState);

	const visibleItems = useMemo(
		() =>
			items.filter((item) => {
				if (!item.get('purchasedAt')) return true;
				return purchasedThisSession.has(item.get('id'));
			}),
		[items, purchasedThisSession],
	);

	// subscribe to the cateogryId on all visible items to re-render when the category changes
	// since the items query won't rerender when this changes... not sure if there's a more
	// straightforward way to approach this.
	const [forcedChange, forceUpdate] = useState(0);
	useEffect(() => {
		const unsubs = visibleItems.map((item) =>
			item.subscribeToField('categoryId', 'change', () => {
				console.log('category changed', item.get('id'));
				forceUpdate((prev) => prev + 1);
			}),
		);

		return () => unsubs.forEach((unsub) => unsub());
	}, [visibleItems]);

	const categoryGroups = useMemo(() => {
		// reference dep item
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		forcedChange;
		const categoryGroups: { category: Category | null; items: Item[] }[] = [];
		const sortedCategories: (Category | null)[] = categories
			.slice()
			.sort((a, b) => {
				if (a.get('sortKey') > b.get('sortKey')) return 1;
				if (a.get('sortKey') < b.get('sortKey')) return -1;
				return 0;
			});
		sortedCategories.push(null);

		const categoryIndexLookup = new Map<string | null, number>();
		for (const category of sortedCategories) {
			const group = {
				category,
				items: [],
			};
			categoryGroups.push(group);
			categoryIndexLookup.set(
				category?.get('id') ?? null,
				categoryGroups.length - 1,
			);
		}
		for (const item of visibleItems) {
			const categoryId = item.get('categoryId');
			const categoryIndex =
				categoryIndexLookup.get(categoryId) ?? categoryIndexLookup.get(null)!;
			categoryGroups[categoryIndex].items.push(item);
		}
		return categoryGroups;
	}, [visibleItems, categories, forcedChange]);

	return {
		categoryGroups,
		itemCount: visibleItems.length,
	};
}
