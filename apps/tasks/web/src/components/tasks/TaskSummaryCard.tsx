import { hooks } from '@/hooks.js';
import { Card } from '@a-type/ui';
import { Link } from '@biscuits/client';
import { Task } from '@tasks.biscuits/verdant';
import { TaskCompleteAction } from './TaskCompleteAction.jsx';
import { TaskRecurrenceTag } from './TaskRecurrenceTag.jsx';

export interface TaskSummaryCardProps {
	task: Task;
}

export function TaskSummaryCard({ task }: TaskSummaryCardProps) {
	const { title } = hooks.useWatch(task);
	return (
		<Card>
			<Card.Main
				render={
					<Link to="/tasks/$taskId" params={{ taskId: task.get('id') }} />
				}
			>
				<Card.Title>{title}</Card.Title>
				<Card.Content>
					<TaskRecurrenceTag task={task} />
				</Card.Content>
			</Card.Main>
			<Card.Footer>
				<Card.Actions>
					<TaskCompleteAction task={task} />
				</Card.Actions>
			</Card.Footer>
		</Card>
	);
}
