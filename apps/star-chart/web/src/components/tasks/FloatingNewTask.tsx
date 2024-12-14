import { hooks } from '@/store.js';
import { FormikForm, Icon, SubmitButton, TextAreaField } from '@a-type/ui';
import {
	MenuDisclose,
	MenuDiscloseContent,
	MenuDiscloseTrigger,
} from '@biscuits/client';
import { useNavigate } from '@verdant-web/react-router';

export interface FloatingNewTaskProps {
	projectId?: string;
}

export function FloatingNewTask({ projectId }: FloatingNewTaskProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<MenuDisclose>
			<MenuDiscloseTrigger>
				<Icon name="plus" className="w-20px h-20px" />
			</MenuDiscloseTrigger>
			<MenuDiscloseContent className="p-3 w-screen max-w-500px">
				<FormikForm
					initialValues={{ content: '' }}
					onSubmit={async (values, tools) => {
						const task = await client.tasks.put({
							content: values.content,
							projectId,
						});
						tools.resetForm();
						navigate(`/task/${task.get('id')}`);
					}}
				>
					<TextAreaField
						autoFocus
						name="content"
						label="What do you need to do?"
					/>
					<SubmitButton>Add task</SubmitButton>
				</FormikForm>
			</MenuDiscloseContent>
		</MenuDisclose>
	);
}
