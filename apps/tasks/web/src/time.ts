import {
	Task,
	TaskRecurrence,
	TaskRecurrenceUnit,
} from '@tasks.biscuits/verdant';
import { add, Duration, DurationUnit } from 'date-fns';

const recurrenceUnitToDateFns: Record<TaskRecurrenceUnit, DurationUnit> = {
	day: 'days',
	week: 'weeks',
	month: 'months',
	year: 'years',
};
export function getRecurrenceTime(
	lastCompletion: number,
	recurrence: TaskRecurrence,
) {
	const unit = recurrenceUnitToDateFns[recurrence.get('unit')];
	return add(lastCompletion, {
		[unit]: recurrence.get('interval'),
	});
}

export function getRecurrenceDuration(recurrence: TaskRecurrence): Duration {
	const unit = recurrenceUnitToDateFns[recurrence.get('unit')];
	return {
		[unit]: recurrence.get('interval'),
	};
}

export function getRecurrencePeriodMs(recurrence: TaskRecurrence): number {
	const duration = getRecurrenceDuration(recurrence);
	const now = Date.now();
	const future = add(now, duration);
	return future.getTime() - now;
}

export function getTaskLatestCompletion(item: Task): number | null {
	const completions = item.get('completions');
	if (!completions || completions.length === 0) return null;

	const latestCompletion = completions.reduce(
		(latest, completion) => {
			if (!latest) return completion.get('completedAt');
			return completion.get('completedAt') > latest ?
					completion.get('completedAt')
				:	latest;
		},
		null as number | null,
	);
	return latestCompletion;
}

export function getIsTaskDone(
	item: Task,
	now = Date.now(),
	epsilon = 0.1,
): boolean {
	const latestCompletion = getTaskLatestCompletion(item);
	const recurrence = item.get('recurrence');

	if (!recurrence) return Boolean(latestCompletion);

	const recurrenceTime = getRecurrenceTime(latestCompletion ?? 0, recurrence);

	const isNearRecurrence =
		Math.abs((recurrenceTime?.getTime() ?? 0) - now) <=
		getRecurrencePeriodMs(recurrence) * epsilon;

	return !isNearRecurrence && (latestCompletion ?? 0) > 0;
}

export const scaleDurations = [
	'None',
	'5 min',
	'30 min',
	'1 hr',
	'1 day',
	'1 weekend',
	'1 week',
];
