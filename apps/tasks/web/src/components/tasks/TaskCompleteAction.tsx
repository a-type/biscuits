import { toggleTaskCompletion } from '@/mutations.js';
import { Button, ButtonProps, Icon } from '@a-type/ui';
import { Task } from '@tasks.biscuits/verdant';
import { useIsTaskDone } from './hooks.js';

export interface TaskCompleteActionProps extends ButtonProps {
	task: Task;
}

export function TaskCompleteAction({
	task,
	children,
	onClick,
	...rest
}: TaskCompleteActionProps) {
	const isDone = useIsTaskDone(task);
	return (
		<Button
			emphasis={isDone ? 'default' : 'primary'}
			{...rest}
			toggled={isDone}
			toggleMode="state-only"
			color={isDone ? 'success' : 'primary'}
			onClick={(ev) => {
				onClick?.(ev);
				if (ev.defaultPrevented) return;
				toggleTaskCompletion(task);
			}}
		>
			<Icon name={isDone ? 'x' : 'check'} />
			{isDone ? 'Undo' : 'Done'}
		</Button>
	);
}
