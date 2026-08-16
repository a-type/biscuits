import { hooks } from '@/hooks.js';
import { getIsTaskDone } from '@/time.js';
import { Task } from '@tasks.biscuits/verdant';

export function useTaskRecurrenceDisplay(item: Task) {
	const { recurrence } = hooks.useWatch(item);
	const live = hooks.useWatch(recurrence);

	if (!live) return null;
	return `${live.interval} ${live.unit}${live.interval > 1 ? 's' : ''}`;
}

const capturedNow = Date.now();
/**
 * Get whether an item is considered "done"
 * If the item is non-recurring, this is just whether it has a completion.
 * If it is recurring, we reset completion within a certain epsilon of the recurrence period, so that the item is considered "done" until it is close to the next recurrence.
 */
export function useIsTaskDone(
	item: Task,
	{
		now = capturedNow,
		epsilon = 0.1, // 10% of recurrence period
	}: {
		now?: number;
		epsilon?: number;
	} = {},
) {
	const { completions, recurrence } = hooks.useWatch(item);
	hooks.useWatch(recurrence);
	hooks.useWatch(completions, { deep: true });

	return getIsTaskDone(item, now, epsilon);
}
