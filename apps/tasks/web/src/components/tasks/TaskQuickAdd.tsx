import { hooks } from '@/hooks.js';
import { Box, FormikForm, SubmitButton, TextField } from '@a-type/ui';
import { useNavigate } from '@tanstack/react-router';

export interface TaskQuickAddProps {}

export function TaskQuickAdd({}: TaskQuickAddProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<FormikForm
			initialValues={{ title: '' }}
			onSubmit={async (values) => {
				const task = await client.tasks.put({ title: values.title });
				navigate({
					to: `/tasks/$taskId`,
					params: {
						taskId: task.get('id'),
					},
				});
			}}
		>
			<Box full gap items="center">
				<TextField name="title" label="Task Title" style={{ flex: 1 }} />
				<SubmitButton>Add task</SubmitButton>
			</Box>
		</FormikForm>
	);
}
