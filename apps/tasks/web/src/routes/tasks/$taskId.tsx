import { TaskDownstreams } from '@/components/tasks/TaskDownstreams.jsx';
import { TaskPlaylistSelect } from '@/components/tasks/TaskPlaylistSelect.jsx';
import { TaskRecurrenceSelect } from '@/components/tasks/TaskRecurrenceSelect.jsx';
import { TaskScaleSelect } from '@/components/tasks/TaskScaleSelect.jsx';
import { TaskUpstreams } from '@/components/tasks/TaskUpstreams.jsx';
import { hooks } from '@/hooks.js';
import { verdant } from '@/store.js';
import { Box, Heading, Icon, PageContent, PageFixedArea } from '@a-type/ui';
import { LinkButton } from '@biscuits/client';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import cls from './$taskId.module.css';

export const Route = createFileRoute('/tasks/$taskId')({
	component: RouteComponent,
	loader: async ({ params }) => {
		verdant.tasks.get(params.taskId);
	},
});

function RouteComponent() {
	const { taskId } = Route.useParams();
	const task = hooks.useTask(taskId);

	if (!task) {
		return (
			<PageContent>
				<p>Task not found</p>
				<LinkButton to="/">Go back</LinkButton>
			</PageContent>
		);
	}

	return (
		<PageContent className={cls.pageContent}>
			<TaskUpstreams task={task} />
			<Box surface p col border gap="lg">
				<PageFixedArea>
					<Box gap items="center" p="md" squish="vertical">
						<LinkButton emphasis="ghost" to="/">
							<Icon name="arrowLeft" />
						</LinkButton>
						<Heading>{task?.get('title')}</Heading>
					</Box>
				</PageFixedArea>
				<Suspense>
					<TaskScaleSelect task={task} />
					<TaskRecurrenceSelect task={task} />
					<TaskPlaylistSelect task={task} />
				</Suspense>
			</Box>
			<Suspense>
				<TaskDownstreams task={task} />
			</Suspense>
		</PageContent>
	);
}
