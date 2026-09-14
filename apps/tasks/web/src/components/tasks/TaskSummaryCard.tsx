import { hooks } from '@/hooks.js';
import { Card, CardRootProps } from '@a-type/ui';
import { Link } from '@biscuits/client';
import { Task } from '@tasks.biscuits/verdant';
import { TaskCompleteAction } from './TaskCompleteAction.jsx';
import { TaskRecurrenceTag } from './TaskRecurrenceTag.jsx';
import { useTaskRecurrenceDisplay } from './hooks.js';

export interface TaskSummaryCardProps extends CardRootProps {
	task: Task;
	disableActions?: boolean;
}

export function TaskSummaryCard({
	task,
	disableActions,
	...rest
}: TaskSummaryCardProps) {
	const { title, blocks } = hooks.useWatch(task);
	const recurrence = useTaskRecurrenceDisplay(task);
	const blockCount = blocks.length;
	return (
		<Card {...rest}>
			<Card.Main
				render={
					<Link to="/tasks/$taskId" params={{ taskId: task.get('id') }} />
				}
			>
				<Card.Title>{title}</Card.Title>
				{recurrence && (
					<Card.Content>
						<TaskRecurrenceTag task={task} />
					</Card.Content>
				)}
				{blockCount > 0 && (
					<Card.Content>
						Blocks {blockCount} task{blockCount > 1 ? 's' : ''}
					</Card.Content>
				)}
			</Card.Main>
			{!disableActions && (
				<Card.Footer>
					<Card.Actions>
						<TaskCompleteAction task={task} />
					</Card.Actions>
				</Card.Footer>
			)}
			<Card.Menu></Card.Menu>
		</Card>
	);
}
