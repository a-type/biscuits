import { hooks } from '@/store.js';
import { Box, clsx, H3 } from '@a-type/ui';
import { CreateSingleTaskButton } from './CreateSingleTaskButton.jsx';
import { TaskListItem } from './TaskListItem.jsx';

export interface SingleTasksProps {
	className?: string;
}

export function SingleTasks({ className }: SingleTasksProps) {
	const [singles] = hooks.useAllTasksInfinite({
		index: {
			where: 'projectId',
			equals: null,
		},
		pageSize: 30,
	});

	return (
		<Box d="col" surface border p="none" gap="none" className={clsx(className)}>
			<H3 className="py-2 px-3 color-gray-dark font-normal uppercase text-xs">
				One-off tasks
			</H3>
			{singles.map((items, i) => (
				<TaskListItem key={i} task={items} />
			))}
			<Box container justify="end" p="md">
				<CreateSingleTaskButton />
			</Box>
		</Box>
	);
}
