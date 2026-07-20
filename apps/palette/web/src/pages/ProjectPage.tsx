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
import { Link, useParams } from '@biscuits/client';
import cls from './ProjectPage.module.css';

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
		<div className={cls.root}>
			<div className={cls.header}>
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
			<div className={cls.main}>
				<div className={cls.canvasArea}>
					<ProjectCanvas project={project} className={cls.canvas} />
					<ProjectColorSpotlight
						project={project}
						className={cls.colorSpotlight}
					/>
				</div>
				<ProjectPalette project={project} className={cls.palette} />
			</div>
		</div>
	);
}

export default ProjectPage;
