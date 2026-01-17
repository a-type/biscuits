import { DeleteColorAction } from '@/components/actions/DeleteColorAction.jsx';
import { RedoAction } from '@/components/actions/RedoAction.jsx';
import { SortAction } from '@/components/actions/SortAction.jsx';
import { ToggleBubblesAction } from '@/components/actions/ToggleBubblesAction.jsx';
import { UndoAction } from '@/components/actions/UndoAction.jsx';
import { ProjectCanvas } from '@/components/projects/ProjectCanvas.jsx';
import { ProjectColorSpotlight } from '@/components/projects/ProjectColorSpotlight.jsx';
import { ProjectPalette } from '@/components/projects/ProjectPalette.jsx';
import { hooks } from '@/hooks.js';
import { ActionBar, Button, H1, Icon, PageContent } from '@a-type/ui';
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
				<Button render={<Link to="/" />}>Back to projects</Button>
			</PageContent>
		);
	}

	return (
		<div className="min-h-100dvh w-full flex flex-col md:h-100dvh">
			<div className="sticky top-0 z-100 row py-1 bg-wash">
				<Button render={<Link to="/" />} emphasis="ghost" size="small">
					<Icon name="arrowLeft" />
					Projects
				</Button>
				<ActionBar>
					<UndoAction />
					<RedoAction />
					<ToggleBubblesAction />
					<DeleteColorAction project={project} />
					<SortAction />
				</ActionBar>
			</div>
			<div className="w-full flex flex-1 flex-col items-stretch items-stretch gap-1 md:min-h-0 md:flex-row">
				<div className="[flex:3_0_auto] min-h-80dvh flex flex-col gap-1 md:[flex:3_0_0] md:h-auto">
					<ProjectCanvas project={project} className="[flex:3_0_200px]" />
					<ProjectColorSpotlight
						project={project}
						className="[flex:1_0_240px] md:[flex:1_0_80px]"
					/>
				</div>
				<ProjectPalette
					project={project}
					className="[flex:1_0_auto] md:([flex:1_0_0] min-h-100px overflow-y-auto)"
				/>
			</div>
		</div>
	);
}

export default ProjectPage;
