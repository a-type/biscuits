import { TaskEditor } from '@/components/tasks/TaskEditor.jsx';
import { hooks } from '@/store.js';
import {
	Button,
	Icon,
	PageContent,
	PageNowPlaying,
	PageRoot,
} from '@a-type/ui';
import { Link, useParams } from '@verdant-web/react-router';

export interface TaskPageProps {}

export function TaskPage({}: TaskPageProps) {
	const { taskId } = useParams();

	const task = hooks.useTask(taskId);

	return (
		<PageRoot>
			<PageContent>
				{task ?
					<TaskEditor task={task} />
				:	<div>
						Task not found. <Link to="/">Go home?</Link>
					</div>
				}
				<PageNowPlaying className="flex-row justify-start w-auto left-50% -translate-x-1/2 right-auto bg-white">
					<Button size="icon" asChild color="ghost">
						<Link to="/">
							<Icon name="arrowLeft" />
						</Link>
					</Button>
				</PageNowPlaying>
			</PageContent>
		</PageRoot>
	);
}

export default TaskPage;
