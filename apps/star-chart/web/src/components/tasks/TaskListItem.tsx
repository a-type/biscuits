import { hooks } from '@/store.js';
import { Button, Checkbox, Icon } from '@a-type/ui';
import { Task } from '@star-chart.biscuits/verdant';
import { Link } from '@verdant-web/react-router';

export interface TaskListItemProps {
	task: Task;
}

export function TaskListItem({ task }: TaskListItemProps) {
	const { id, content, completedAt } = hooks.useWatch(task);

	return (
		<div className="row p-2">
			<Checkbox
				checked={!!completedAt}
				onCheckedChange={(checked) => {
					if (checked) {
						task.set('completedAt', Date.now());
					} else {
						task.set('completedAt', null);
					}
				}}
			/>
			<Button
				color="ghost"
				className="rounded-none font-normal justify-between flex-1"
				asChild
			>
				<Link to={`/task/${id}`}>
					<span>{content}</span>
					<Icon name="arrowRight" />
				</Link>
			</Button>
		</div>
	);
}
