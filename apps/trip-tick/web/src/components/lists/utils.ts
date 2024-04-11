import {
  ListItemsItem,
  ListItemsItemCondition,
  ListItemsItemPeriod,
} from '@trip-tick.biscuits/verdant';
import pluralize from 'pluralize';

export function getItemRulesLabel(item: ListItemsItem) {
  const quantity = item.get('quantity');
  const period = item.get('period');
  const periodMultiplier = item.get('periodMultiplier');
  const condition = item.get('condition');
  const additional = item.get('additional');

  let shortString = `${quantity} per `;
  if (periodMultiplier !== 1 && period !== 'trip') {
    shortString += `${periodMultiplier} `;
  }
  if (condition) {
    shortString += conditionNames[condition] + ' ';
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

export const conditionNames: Record<ListItemsItemCondition, string> = {
  cold: 'cold',
  hot: 'hot',
  rain: 'rainy',
};
