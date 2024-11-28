import { hooks } from '@/store.js';
import { H1 } from '@a-type/ui';
import { Project } from '@star-chart.biscuits/verdant';

export interface ProjectTitleProps {
	project: Project;
}

export function ProjectTitle({ project }: ProjectTitleProps) {
	const { name } = hooks.useWatch(project);
	return (
		<H1 className="absolute -z-1 opacity-10 !text-10vmin !sm:text-6xl left-6 top-10">
			{name}
		</H1>
	);
}
