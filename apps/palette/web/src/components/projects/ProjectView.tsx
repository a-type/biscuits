import { Project } from '@palette.biscuits/verdant';
import { ProjectCanvas } from './ProjectCanvas.jsx';
import { ProjectPalette } from './ProjectPalette.jsx';
import { ProjectColorSpotlight } from './ProjectColorSpotlight.jsx';

export interface ProjectViewProps {
	project: Project;
	showBubbles: boolean;
}

export function ProjectView({ project, showBubbles }: ProjectViewProps) {
	return (
		<div className="flex flex-col items-stretch md:flex-row w-full h-full overflow-hidden gap-1">
			<ProjectCanvas
				project={project}
				className="[flex:3_0_auto]"
				showBubbles={showBubbles}
			/>
			<ProjectPalette project={project} className="[flex:1]" />
			<ProjectColorSpotlight project={project} className="[flex:1_0_100px]" />
		</div>
	);
}
