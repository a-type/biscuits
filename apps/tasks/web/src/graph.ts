import { Task } from '@tasks.biscuits/verdant';
import { use } from 'react';
import { verdant } from './store.js';
import { getIsTaskDone } from './time.js';

const upstreamGraph: WeakMap<Task, Promise<Task[]>> = new WeakMap();

export function getUpstreams(task: Task): Promise<Task[]> {
	const cached = upstreamGraph.get(task);
	if (cached) return cached;
	const promise = (async () => {
		return verdant.tasks.findAll({
			key: `upstreams-${task.get('id')}`,
			index: {
				where: 'blocks',
				equals: task.get('id'),
			},
		}).resolved;
	})();
	upstreamGraph.set(task, promise);
	return promise;
}

export function useOnlyUnblockedTasks(tasks: Task[]) {
	const upstreams = tasks.map((task) => use(getUpstreams(task)));
	return tasks.filter(
		(_, index) =>
			upstreams[index].filter((task) => !getIsTaskDone(task)).length === 0,
	);
}
