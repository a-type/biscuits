import { CreateProjectButton } from '@/components/project/CreateProjectButton.jsx';
import { ProjectCard } from '@/components/project/ProjectCard.jsx';
import { hooks } from '@/store.js';
import {
	CardGrid,
	H1,
	Icon,
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
				<H1 className="mb-2">Projects</H1>
				<CardGrid>
					{projects.map((proj) => (
						<ProjectCard key={proj.uid} project={proj} />
					))}
				</CardGrid>
				<PageNowPlaying unstyled className="row items-center justify-center">
					<CreateProjectButton
						color="primary"
						size="icon"
						className="shadow-xl w-48px h-48px items-center justify-center"
					>
						<Icon name="plus" className="w-20px h-20px" />
					</CreateProjectButton>
				</PageNowPlaying>
			</PageContent>
		</PageRoot>
	);
}

export default HomePage;
