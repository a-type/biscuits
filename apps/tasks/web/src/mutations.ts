import { Task } from '@tasks.biscuits/verdant';
import { getIsTaskDone } from './time.js';

export function toggleTaskCompletion(
	item: Task,
	{
		userId,
	}: {
		userId?: string;
	} = {},
) {
	const isDone = getIsTaskDone(item);
	const completions = item.get('completions');
	if (isDone) {
		completions.delete(completions.length - 1);
	} else {
		completions.push({
			completedAt: Date.now(),
			completedBy: userId,
		});
	}
}
