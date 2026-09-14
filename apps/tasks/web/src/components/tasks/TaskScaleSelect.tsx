import { hooks } from '@/hooks.js';
import { scaleDurations } from '@/time.js';
import { ToggleGroup } from '@a-type/ui';
import { Task } from '@tasks.biscuits/verdant';

export interface TaskScaleSelectProps {
	task: Task;
}

const scaleItems = scaleDurations.map((label, index) => ({
	label,
	value: index.toString(),
}));

export function TaskScaleSelect({ task }: TaskScaleSelectProps) {
	const { scale } = hooks.useWatch(task);
	const match = scaleItems[scale ?? 0];

	return (
		<ToggleGroup
			value={[match?.value ?? '1']}
			onValueChange={([v]) => task.set('scale', parseInt(v))}
			className="flex-wrap"
		>
			{scaleItems.map(({ label, value }) => (
				<ToggleGroup.Item key={value} value={value}>
					{label}
				</ToggleGroup.Item>
			))}
		</ToggleGroup>
	);
}
