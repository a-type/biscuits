import { Chip, ChipProps } from '@a-type/ui';
import { Task } from '@tasks.biscuits/verdant';
import { useTaskRecurrenceDisplay } from './hooks.js';

export interface TaskRecurrenceTagProps extends ChipProps {
	task: Task;
}

export function TaskRecurrenceTag({ task, ...rest }: TaskRecurrenceTagProps) {
	const value = useTaskRecurrenceDisplay(task);
	if (!value) return null;
	return <Chip {...rest}>{value}</Chip>;
}
