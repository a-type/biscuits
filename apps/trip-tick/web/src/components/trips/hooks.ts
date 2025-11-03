import { getComputedQuantity } from '@/components/trips/utils.js';
import { hooks } from '@/store.js';
import { Trip } from '@trip-tick.biscuits/verdant';
import { differenceInDays } from 'date-fns/differenceInDays';

export function useTripProgress(
	trip: Trip,
	{ listFilter }: { listFilter?: string[] } = {},
) {
	const { lists, completions, extraItems } = hooks.useWatch(trip);
	const days = useTripDays(trip);
	hooks.useWatch(lists, { deep: true });
	hooks.useWatch(completions);
	hooks.useWatch(extraItems);
	const allLists = hooks.useAllLists();

	const mappedLists = lists
		.map((id) => allLists.find((l) => l.get('id') === id))
		.filter(function nonNil<T>(x: T | undefined): x is T {
			return x !== undefined;
		})
		.filter((list) => {
			if (!listFilter) {
				return true;
			}
			return listFilter.includes(list.get('id'));
		})
		.map((list) => list.getSnapshot());

	const extraItemCount = extraItems
		.entries()
		.filter(([listId]) => !listFilter || listFilter.includes(listId))
		.reduce((acc, [_, exList]) => {
			return exList.getAll().reduce((acc, ex) => {
				return acc + ex.get('quantity');
			}, acc);
		}, 0);
	const totalItems = mappedLists.reduce((acc, list) => {
		return (
			acc +
			list.items.reduce((acc, item) => {
				return (
					acc +
					getComputedQuantity({
						quantity: item.quantity,
						roundDown: item.roundDown,
						days,
						periodMultiplier: item.periodMultiplier,
						additional: item.additional,
						conditions: item.conditions,
						period: item.period,
					})
				);
			}, 0)
		);
	}, extraItemCount);

	// starting from lists because completions may include data
	// from lists that are no longer included
	const completedItems = lists
		.getSnapshot()
		.filter((listId) => !listFilter || listFilter.includes(listId))
		.reduce((acc, listId) => {
			const list = allLists.find((l) => l.get('id') === listId);
			if (!list) {
				return acc;
			}
			const listItems = list.get('items');
			let completedQuantities = listItems.getSnapshot().reduce((acc2, item) => {
				return acc2 + (completions.get(item.id!) ?? 0);
			}, 0);
			// include extra items added to this list
			const extras = extraItems.get(listId);
			if (extras) {
				completedQuantities += extras.getAll().reduce((acc2, ex) => {
					return acc2 + (completions.get(ex.get('id')) ?? 0);
				}, 0);
			}
			return acc + completedQuantities;
		}, 0);

	return {
		totalItems,
		completedItems,
		value: completedItems / totalItems,
	};
}

/**
 * Total number of days, including the first day and the last day.
 */
export function useTripDays(trip: Trip) {
	const { startsAt, endsAt } = hooks.useWatch(trip);
	if (!startsAt || !endsAt) {
		return 0;
	}
	return differenceInDays(endsAt, startsAt) + 1;
}
