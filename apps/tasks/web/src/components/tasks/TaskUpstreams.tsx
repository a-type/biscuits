import { hooks } from '@/hooks.js';
import { Box } from '@a-type/ui';
import { Task } from '@tasks.biscuits/verdant';
import { Connector } from './Connector.jsx';
import { TaskSummaryCard } from './TaskSummaryCard.jsx';

export interface TaskUpstreamsProps {
	task: Task;
}

export function TaskUpstreams({ task }: TaskUpstreamsProps) {
	const { id } = hooks.useWatch(task);
	const upstreams = hooks.useAllTasks({
		key: `upstreams-${id}`,
		index: {
			where: 'blocks',
			equals: id,
		},
	});

	if (!upstreams.length) {
		return null;
	}

	return (
		<Box col>
			<Box col gap>
				{upstreams.map((upstream) => (
					<TaskSummaryCard size="sm" task={upstream} key={upstream.uid} />
				))}
			</Box>
			<Connector type="straight" />
		</Box>
	);
}
