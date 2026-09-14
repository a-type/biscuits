import { hooks } from '@/hooks.js';
import { Box, Button, Icon, NumberStepper, ToggleGroup } from '@a-type/ui';
import {
	Task,
	TaskRecurrenceInit,
	TaskRecurrenceUnit,
} from '@tasks.biscuits/verdant';

export interface TaskRecurrenceSelectProps {
	task: Task;
}

export function TaskRecurrenceSelect({ task }: TaskRecurrenceSelectProps) {
	const { recurrence } = hooks.useWatch(task);
	hooks.useWatch(recurrence);

	function update(diff: TaskRecurrenceInit) {
		if (!recurrence) {
			task.set('recurrence', diff);
		} else {
			recurrence.update(diff);
		}
	}

	if (!recurrence) {
		return (
			<Button
				size="small"
				emphasis="ghost"
				onClick={() => update({ interval: 1, unit: 'day' })}
				align="start"
			>
				<Icon name="plus" aria-label="Add" /> Recurrence
			</Button>
		);
	}

	return (
		<Box gap="md" col>
			<NumberStepper
				value={recurrence?.get('interval') ?? 0}
				onChange={(v) => update({ interval: v })}
			/>
			<ToggleGroup
				value={[recurrence?.get('unit') ?? 'day']}
				onValueChange={([v]) => update({ unit: v as TaskRecurrenceUnit })}
			>
				<ToggleGroup.Item value="day">Days</ToggleGroup.Item>
				<ToggleGroup.Item value="week">Weeks</ToggleGroup.Item>
				<ToggleGroup.Item value="month">Months</ToggleGroup.Item>
				<ToggleGroup.Item value="year">Years</ToggleGroup.Item>
			</ToggleGroup>
		</Box>
	);
}
