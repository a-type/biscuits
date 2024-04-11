import { FragmentOf, ResultOf, graphql, readFragment } from '@biscuits/client';
import {
  ListItemsItemCondition,
  ListItemsItemPeriod,
} from '@trip-tick.biscuits/verdant';

export function getComputedQuantity({
  quantity,
  roundDown,
  days: rawDays,
  condition,
  period,
  periodMultiplier,
  additional,
  weather: forecast,
  hotThreshold = 70,
  coldThreshold = 50,
}: {
  quantity: number;
  roundDown: boolean;
  days: number;
  condition: ListItemsItemCondition | null;
  period: ListItemsItemPeriod;
  periodMultiplier: number;
  additional: number;
  weather?: ResultOf<typeof quantityForecast>;
  hotThreshold?: number;
  coldThreshold?: number;
}) {
  const rainDays = forecast?.days?.filter((day) => day.willRain).length || 0;
  const hotDays =
    forecast?.days?.filter((day) => day.high > hotThreshold).length || 0;
  const coldDays =
    forecast?.days?.filter((day) => day.low < coldThreshold).length || 0;

  let unrounded = 0;
  let conditionedDays = rawDays;
  switch (condition) {
    case 'cold':
      conditionedDays = coldDays;
      break;
    case 'hot':
      conditionedDays = hotDays;
      break;
    case 'rain':
      conditionedDays = rainDays;
      break;
  }
  const conditionedNights =
    conditionedDays === 0 ? 0 : Math.max(1, conditionedDays - 1);

  switch (period) {
    case 'day':
      unrounded = (conditionedDays / periodMultiplier) * quantity;
      break;
    case 'night':
      unrounded = (conditionedNights / periodMultiplier) * quantity;
      break;
    case 'trip':
      unrounded = conditionedDays ? quantity : 0;
      break;
  }
  unrounded = Math.max(0, unrounded);

  if (unrounded === 0) return 0;

  return (
    additional + (roundDown ? Math.floor(unrounded) : Math.ceil(unrounded))
  );
}

export const quantityForecast = graphql(`
  fragment QuantityForecast on WeatherForecast @_unmask {
    days {
      low
      high
      willRain
    }
  }
`);
