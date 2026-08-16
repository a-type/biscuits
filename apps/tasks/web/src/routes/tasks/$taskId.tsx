import { hooks } from '@/hooks.js';
import { verdant } from '@/store.js';
import { Box, Heading, Icon, PageContent, PageFixedArea } from '@a-type/ui';
import { LinkButton } from '@biscuits/client';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/tasks/$taskId')({
	component: RouteComponent,
	loader: async ({ params }) => {
		verdant.tasks.get(params.taskId);
	},
});

function RouteComponent() {
	const { taskId } = Route.useParams();
	const task = hooks.useTask(taskId);
	return (
		<PageContent>
			<PageFixedArea>
				<Box gap items="center" p="md" squish="vertical">
					<LinkButton emphasis="ghost" to="/">
						<Icon name="arrowLeft" />
					</LinkButton>
					<Heading>{task?.get('title')}</Heading>
				</Box>
			</PageFixedArea>
		</PageContent>
	);
}
