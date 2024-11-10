import { ProjectCanvas } from '@/components/projects/ProjectCanvas.jsx';
import { ProjectColorSpotlight } from '@/components/projects/ProjectColorSpotlight.jsx';
import { ProjectPalette } from '@/components/projects/ProjectPalette.jsx';
import { hooks } from '@/hooks.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { PageContent } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { Link, useParams } from '@verdant-web/react-router';

export interface ProjectPageProps {}

export function ProjectPage({}: ProjectPageProps) {
	const id = useParams().id;
	const project = hooks.useProject(id);

	if (!project) {
		return (
			<PageContent className="gap-4">
				<H1>Project missing</H1>
				<p>Sorry, couldn't find this project. Maybe it was deleted?</p>
				<Button asChild>
					<Link to="/">Back to projects</Link>
				</Button>
			</PageContent>
		);
	}

	return (
		<div className="flex flex-col p-0 m-0 w-full min-h-100vh">
			<div className="flex flex-col items-stretch md:flex-row w-full h-full gap-1">
				<div className="flex flex-col gap-1 [flex:3_0_0]">
					<div className="row py-1">
						<Button asChild color="ghost" size="small">
							<Link to="/">
								<Icon name="arrowLeft" />
								Back to projects
							</Link>
						</Button>
					</div>
					<ProjectCanvas project={project} className="[flex:3_0_0]" />
				</div>
				<ProjectPalette project={project} className="[flex:1_0_80px]" />
				<ProjectColorSpotlight project={project} className="[flex:1_0_70px]" />
			</div>
		</div>
	);
}

export default ProjectPage;
