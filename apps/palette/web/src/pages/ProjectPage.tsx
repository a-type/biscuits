import { DeleteColorAction } from '@/components/actions/DeleteColorAction.jsx';
import { RedoAction } from '@/components/actions/RedoAction.jsx';
import { SortAction } from '@/components/actions/SortAction.jsx';
import { ToggleBubblesAction } from '@/components/actions/ToggleBubblesAction.jsx';
import { UndoAction } from '@/components/actions/UndoAction.jsx';
import { ProjectCanvas } from '@/components/projects/ProjectCanvas.jsx';
import { ProjectColorSpotlight } from '@/components/projects/ProjectColorSpotlight.jsx';
import { ProjectPalette } from '@/components/projects/ProjectPalette.jsx';
import { hooks } from '@/hooks.js';
import { ActionBar } from '@a-type/ui/components/actions';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { PageContent } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { usePageTitle } from '@biscuits/client';
import { Link, useParams } from '@verdant-web/react-router';

export interface ProjectPageProps {}

export function ProjectPage({}: ProjectPageProps) {
	const id = useParams().id;
	const project = hooks.useProject(id);
	usePageTitle('Palette');

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
		<div className="w-full min-h-100dvh flex flex-col md:h-100dvh">
			<div className="row py-1 sticky z-100 bg-wash top-0">
				<Button asChild color="ghost" size="small">
					<Link to="/">
						<Icon name="arrowLeft" />
						Projects
					</Link>
				</Button>
				<ActionBar>
					<UndoAction />
					<RedoAction />
					<ToggleBubblesAction />
					<DeleteColorAction project={project} />
					<SortAction />
				</ActionBar>
			</div>
			<div className="flex flex-col items-stretch md:flex-row w-full gap-1 flex-1 items-stretch md:min-h-0">
				<div className="flex flex-col gap-1 [flex:3_0_auto] min-h-80dvh md:h-auto md:[flex:3_0_0]">
					<ProjectCanvas project={project} className="[flex:3_0_200px]" />
					<ProjectColorSpotlight
						project={project}
						className="[flex:1_0_240px] md:[flex:1_0_80px]"
					/>
				</div>
				<ProjectPalette
					project={project}
					className="[flex:1_0_auto] md:(overflow-y-auto min-h-100px [flex:1_0_0])"
				/>
			</div>
		</div>
	);
}

export default ProjectPage;
