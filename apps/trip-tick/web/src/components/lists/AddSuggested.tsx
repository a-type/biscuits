import { hooks } from '@/store.js';
import { ActionButton } from '@a-type/ui/components/actions';
import { ListItems, ListItemsItemInit } from '@trip-tick.biscuits/verdant';
import { H3 } from '@a-type/ui/components/typography';
import { useCanSync } from '@biscuits/client';

export interface AddSuggestedProps {
  items: ListItems;
}

const basicSuggestions: ListItemsItemInit[] = [
  {
    description: 'Shirts',
    quantity: 1,
    periodMultiplier: 1,
    period: 'night',
  },
  {
    description: 'Pants',
    quantity: 1,
    periodMultiplier: 2,
    roundDown: true,
    period: 'night',
  },
  {
    description: 'Underwear',
    quantity: 1,
    periodMultiplier: 1,
    additional: 1,
    period: 'night',
  },
  {
    description: 'Socks',
    quantity: 1,
    periodMultiplier: 1,
    period: 'night',
  },
  {
    description: 'Toiletries',
    quantity: 1,
    period: 'trip',
  },
  {
    description: 'Charger',
    quantity: 1,
    period: 'trip',
  },
];

const powerSuggestions: ListItemsItemInit[] = [
  {
    description: 'Rain jacket',
    quantity: 1,
    period: 'trip',
    conditions: [
      {
        type: 'rain',
      },
    ],
  },
  {
    description: 'Sunglasses',
    quantity: 1,
    period: 'trip',
    conditions: [{ type: 'hot', params: { temperature: 299 } }],
  },
  {
    description: 'Coat or jacket',
    quantity: 1,
    period: 'trip',
    conditions: [
      {
        type: 'cold',
        params: { temperature: 277 },
      },
    ],
  },
];

export function AddSuggested({ items }: AddSuggestedProps) {
  const existing = hooks.useWatch(items);
  const isSubscribed = useCanSync();

  let suggestions = basicSuggestions;
  if (isSubscribed) {
    suggestions = [...suggestions, ...powerSuggestions];
  }

  const filtered = suggestions.filter(
    (d) => !existing.some((e) => e.get('description') === d.description),
  );

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div>
      <H3 className="mb-2">Suggestions</H3>
      <div className="flex flex-row flex-wrap gap-1">
        {filtered.map((d) => (
          <ActionButton key={d.description} onClick={() => items.push(d)}>
            {d.description}
          </ActionButton>
        ))}
      </div>
    </div>
  );
}
