import { Project } from '@star-chart.biscuits/verdant';
import { H1 } from '@a-type/ui/components/typography';
import { hooks } from '@/store.js';

export interface ProjectTitleProps {
  project: Project;
}

export function ProjectTitle({ project }: ProjectTitleProps) {
  const { name } = hooks.useWatch(project);
  return (
    <H1 className="absolute -z-1 opacity-20 text-4xl left-2 top-2">{name}</H1>
  );
}
