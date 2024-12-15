import { graphql } from '@/graphql.js';
import { ResultOf } from '@biscuits/graphql';
import {
	ListItemsItemConditionsItemSnapshot,
	ListItemsItemConditionsSnapshot,
	ListItemsItemPeriod,
} from '@trip-tick.biscuits/verdant';

export function getComputedQuantity({
	quantity,
	roundDown,
	days: rawDays,
	conditions,
	period,
	periodMultiplier,
	additional,
	weather: forecast,
}: {
	quantity: number;
	roundDown: boolean;
	days: number;
	conditions: ListItemsItemConditionsSnapshot | null;
	period: ListItemsItemPeriod;
	periodMultiplier: number;
	additional: number;
	weather?: ResultOf<typeof quantityForecast>;
}) {
	let unrounded = 0;
	let conditionedDays =
		conditions?.length ?
			(forecast?.days ?? []).filter((day) => {
				if (!conditions) return true;
				return conditions.every((condition) => matchDay(day, condition));
			}).length
		:	rawDays;

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
		additional +
		(roundDown ? Math.max(1, Math.floor(unrounded)) : Math.ceil(unrounded))
	);
}

function matchDay(
	day: { low: number; high: number; willRain: boolean },
	condition: ListItemsItemConditionsItemSnapshot,
) {
	switch (condition.type) {
		case 'rain':
			return day.willRain;
		case 'hot':
			return day.high > (condition.params.temperature ?? 299);
		case 'cold':
			return day.low < (condition.params.temperature ?? 277);
	}
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
