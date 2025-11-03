import { Button, clsx, Icon } from '@a-type/ui';
import { Task } from '@star-chart.biscuits/verdant';
import { useDeleteTask } from './hooks.js';

export interface TaskMenuProps {
	task: Task;
	className?: string;
}

export function TaskMenu({ task, className, ...rest }: TaskMenuProps) {
	const id = task.get('id');
	const deleteTask = useDeleteTask();

	return (
		<div className={clsx('row justify-end', className)} {...rest}>
			<Button color="attention" emphasis="ghost" onClick={() => deleteTask(id)}>
				<Icon name="trash" />
			</Button>
		</div>
	);
}
