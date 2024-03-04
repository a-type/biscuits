import { getComputedQuantity } from '@/components/trips/utils.js';
import { hooks } from '@/store.js';
import { List, Trip } from '@packing-list/verdant';

export function useTripProgress(
  trip: Trip,
  { listFilter }: { listFilter?: string[] } = {},
) {
  const { lists, completions } = hooks.useWatch(trip);
  const days = useTripDays(trip);
  hooks.useWatch(lists);
  hooks.useWatch(completions);
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
            perDays: item.perDays,
            additional: item.additional,
          })
        );
      }, 0)
    );
  }, 0);

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
      const completedQuantities = listItems
        .getSnapshot()
        .reduce((acc2, item) => {
          return acc2 + (completions.get(item.id!) ?? 0);
        }, 0);
      return acc + completedQuantities;
    }, 0);

  return {
    totalItems,
    completedItems,
    value: completedItems / totalItems,
  };
}

export function useTripDays(trip: Trip) {
  const { startsAt, endsAt } = hooks.useWatch(trip);
  if (!startsAt || !endsAt) {
    return 0;
  }
  return Math.round((endsAt - startsAt) / 86400000) + 1;
}
