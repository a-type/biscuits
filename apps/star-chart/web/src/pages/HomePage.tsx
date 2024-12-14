import { CreateProjectButton } from '@/components/project/CreateProjectButton.jsx';
import { ProjectCard } from '@/components/project/ProjectCard.jsx';
import { FloatingNewTask } from '@/components/tasks/FloatingNewTask.jsx';
import { SingleTasks } from '@/components/tasks/SingleTasks.jsx';
import { hooks } from '@/store.js';
import {
	Box,
	CardGrid,
	PageContent,
	PageNowPlaying,
	PageRoot,
} from '@a-type/ui';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	const projects = hooks.useAllProjects();

	return (
		<PageRoot>
			<PageContent>
				<Box container direction="col">
					<SingleTasks />
					<Box container direction="col" surface border p="md">
						<CardGrid>
							{projects.map((proj) => (
								<ProjectCard key={proj.uid} project={proj} />
							))}
						</CardGrid>
						<Box container justify="end">
							<CreateProjectButton />
						</Box>
					</Box>
				</Box>
				<PageNowPlaying unstyled className="row items-center justify-center">
					<FloatingNewTask />
				</PageNowPlaying>
			</PageContent>
		</PageRoot>
	);
}

export default HomePage;
