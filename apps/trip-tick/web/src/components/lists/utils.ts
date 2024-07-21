import {
  ListItemsItem,
  ListItemsItemConditionsItemType,
  ListItemsItemPeriod,
} from '@trip-tick.biscuits/verdant';
import pluralize from 'pluralize';

export function getItemRulesLabel(item: ListItemsItem) {
  const quantity = item.get('quantity');
  const period = item.get('period');
  const periodMultiplier = item.get('periodMultiplier');
  const conditions = item.get('conditions');
  const additional = item.get('additional');

  let shortString = `${quantity} per `;
  if (periodMultiplier !== 1 && period !== 'trip') {
    shortString += `${periodMultiplier} `;
  }
  if (conditions.length > 0) {
    for (const condition of conditions) {
      shortString += conditionNames[condition.get('type')] + ' ';
    }
  }
  shortString += pluralize(periodNames[period], periodMultiplier);
  if (additional) {
    shortString += ` + ${additional}`;
  }
  return shortString;
}

export const periodNames: Record<ListItemsItemPeriod, string> = {
  day: 'day',
  trip: 'trip',
  night: 'night',
};

export const conditionNames: Record<ListItemsItemConditionsItemType, string> = {
  cold: 'cold',
  hot: 'hot',
  rain: 'rainy',
};
