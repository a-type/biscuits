import { hooks } from '@/hooks.js';
import { Box, TextSkeleton } from '@a-type/ui';
import { Task } from '@tasks.biscuits/verdant';
import { Suspense } from 'react';
import { Connector } from './Connector.jsx';
import { TaskAddDownstreamMenu } from './TaskAddDownstreamMenu.jsx';
import { TaskSummaryCard } from './TaskSummaryCard.jsx';

export interface TaskDownstreamsProps {
	task: Task;
}

export function TaskDownstreams({ task }: TaskDownstreamsProps) {
	const { blocks } = hooks.useWatch(task);
	const liveBlocks = hooks.useWatch(blocks);

	return (
		<Box col dim>
			<Connector type="angle" />
			<Box col gap>
				{liveBlocks.map((blocked) => (
					<Suspense key={blocked} fallback={<TextSkeleton maxLength={16} />}>
						<DownstreamTask taskId={blocked} key={blocked} />
					</Suspense>
				))}
			</Box>
			{liveBlocks.length > 0 && <Connector type="straight" />}
			<TaskAddDownstreamMenu task={task} emphasis="light" align="start" />
		</Box>
	);
}

function DownstreamTask({ taskId }: { taskId: string }) {
	const task = hooks.useTask(taskId);
	if (!task) return null;

	return <TaskSummaryCard task={task} size="sm" disableActions />;
}
