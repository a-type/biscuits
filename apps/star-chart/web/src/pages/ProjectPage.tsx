import { ProjectCanvas } from '@/components/project/ProjectCanvas.jsx';
import { hooks } from '@/store.js';
import { UserMenu } from '@biscuits/client';
import { useParams } from '@verdant-web/react-router';

export interface ProjectPageProps {}

export function ProjectPage({}: ProjectPageProps) {
  const { projectId } = useParams();
  const project = hooks.useProject(projectId);

  if (!project) {
    return <div>Not found</div>;
  }

  return (
    <div className="w-full h-full relative">
      <ProjectCanvas project={project} />
      <div className="fixed top-0 left-0 right-0 py-2 row items-center pointer-events-none">
        <UserMenu className="pointer-events-auto ml-auto" />
      </div>
    </div>
  );
}

export default ProjectPage;
