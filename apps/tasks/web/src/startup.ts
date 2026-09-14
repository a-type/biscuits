/**
 * Startup synchronization operations
 */

import { Client } from '@tasks.biscuits/verdant';
import { getIsTaskDone } from './time.js';

export async function startup(store: Client) {
	// list all pending tasks and iteratively update
	// the blockedBy metadata snapshots by checking the current
	// status of upstream blocking tasks
	const uncompletedTasks = await store.tasks.findAll({
		index: {
			where: 'scheduledAt',
			lte: Date.now(),
		},
	}).resolved;

	for (const task of uncompletedTasks) {
		const blockedBy = task.get('blockedBy');
		for (const blockedInfo of blockedBy) {
			const blockedTaskId = blockedInfo.get('taskId');
			const blockedTask = await store.tasks.get(blockedTaskId).resolved;
			if (!blockedTask) {
				// if the blocked task doesn't exist, mark it as inactive
				blockedInfo.set('active', false);
			} else {
				const blockedTaskDone = getIsTaskDone(blockedTask);
				blockedInfo.set('active', !blockedTaskDone);
			}
		}
	}
}
