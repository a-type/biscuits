import { ProjectView } from '@/components/projects/ProjectView.jsx';
import { hooks } from '@/hooks.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { PageContent } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { Link, useParams } from '@verdant-web/react-router';
import { useState } from 'react';

export interface ProjectPageProps {}

export function ProjectPage({}: ProjectPageProps) {
  const id = useParams().id;
  const project = hooks.useProject(id);

  const [showBubbles, setShowBubbles] = useState(true);

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
    <div className="flex flex-col p-0 m-0 w-full h-100vh">
      <div className="row py-1">
        <Button asChild color="ghost" size="small">
          <Link to="/">
            <Icon name="arrowLeft" />
            Back to projects
          </Link>
        </Button>
        <Button
          toggled={showBubbles}
          onClick={() => setShowBubbles((v) => !v)}
          size="icon"
          className="ml-auto mr-2"
        >
          <Icon name="waterDrop" />
        </Button>
      </div>
      <ProjectView project={project} showBubbles={showBubbles} />
    </div>
  );
}

export default ProjectPage;
