import { hooks } from '@/hooks.js';
import { Box } from '@a-type/ui';
import { TaskSummaryCard } from '../tasks/TaskSummaryCard.jsx';

export interface TopBlockerProps {}

export function TopBlocker({}: TopBlockerProps) {
	const task = hooks.useOneTask({
		key: 'top-blocker',
		index: {
			where: 'blocks',
			order: 'desc',
		},
	});

	if (!task) {
		return <Box>None of your tasks are blocked.</Box>;
	}

	return <TaskSummaryCard task={task} />;
}
