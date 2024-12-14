import { hooks } from '@/store.js';
import { Box, clsx, TextArea } from '@a-type/ui';
import { Task } from '@star-chart.biscuits/verdant';

export interface TaskEditorProps {
	task: Task;
	className?: string;
}

export function TaskEditor({ task, className }: TaskEditorProps) {
	const { content } = hooks.useWatch(task);

	return (
		<Box className={clsx('w-full', className)}>
			<TextArea
				className="text-lg w-full"
				value={content}
				onChange={(v) => task.set('content', v.currentTarget.value)}
				autoSize
				padBottomPixels={24}
				autoFocus={!content}
			/>
		</Box>
	);
}
