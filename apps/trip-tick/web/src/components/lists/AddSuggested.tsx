import { hooks } from '@/store.js';
import { ActionButton } from '@a-type/ui/components/actions';
import { ListItems, ListItemsItemInit } from '@trip-tick.biscuits/verdant';
import { H3 } from '@a-type/ui/components/typography';

export interface AddSuggestedProps {
  items: ListItems;
}

const suggestions: ListItemsItemInit[] = [
  {
    description: 'Shirts',
    quantity: 1,
    perDays: 1,
  },
  {
    description: 'Pants',
    quantity: 1,
    perDays: 2,
    roundDown: true,
  },
  {
    description: 'Underwear',
    quantity: 1,
    perDays: 1,
    additional: 1,
  },
  {
    description: 'Socks',
    quantity: 1,
    perDays: 1,
  },
  {
    description: 'Toiletries',
    quantity: 1,
  },
  {
    description: 'Charger',
    quantity: 1,
  },
];

export function AddSuggested({ items }: AddSuggestedProps) {
  const existing = hooks.useWatch(items);

  return (
    <div>
      <H3 className="mb-2">Suggestions</H3>
      <div className="flex flex-row flex-wrap gap-1">
        {suggestions
          .filter(
            (d) =>
              !existing.some((e) => e.get('description') === d.description),
          )
          .map((d) => (
            <ActionButton key={d.description} onClick={() => items.push(d)}>
              {d.description}
            </ActionButton>
          ))}
      </div>
    </div>
  );
}
