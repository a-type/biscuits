import { hooks } from '@/hooks.js';
import { Box, FormikForm, SubmitButton, TextField } from '@a-type/ui';
import { useNavigate } from '@tanstack/react-router';
import { Task } from '@tasks.biscuits/verdant';

export interface TaskQuickAddProps {
	/** Overrides default create navigation */
	onCreate?: (task: Task) => void;
	autoFocus?: boolean;
}

export function TaskQuickAdd({ onCreate, autoFocus }: TaskQuickAddProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<FormikForm
			initialValues={{ title: '' }}
			onSubmit={async (values) => {
				const task = await client.tasks.put({ title: values.title });
				if (onCreate) {
					return onCreate(task);
				}
				navigate({
					to: `/tasks/$taskId`,
					params: {
						taskId: task.get('id'),
					},
				});
			}}
		>
			<Box full gap items="center">
				<TextField
					name="title"
					label="Task Title"
					style={{ flex: 1 }}
					autoFocus={autoFocus}
				/>
				<SubmitButton>Add task</SubmitButton>
			</Box>
		</FormikForm>
	);
}
