import { Project } from '@palette.biscuits/verdant';
import { ProjectCanvas } from './ProjectCanvas.jsx';
import { ProjectPalette } from './ProjectPalette.jsx';
import { ProjectColorSpotlight } from './ProjectColorSpotlight.jsx';

export interface ProjectViewProps {
	project: Project;
}

export function ProjectView({ project }: ProjectViewProps) {
	return (
		<div className="flex flex-col items-stretch md:flex-row w-full h-full overflow-hidden gap-1">
			<ProjectCanvas project={project} className="[flex:3_0_0]" />
			<ProjectPalette project={project} className="[flex:1_0_50px]" />
			<ProjectColorSpotlight project={project} className="[flex:1_0_100px]" />
		</div>
	);
}
