import { Project } from '@star-chart.biscuits/verdant';
import {
  CardRoot,
  CardMain,
  CardFooter,
  CardActions,
  CardTitle,
} from '@a-type/ui/components/card';
import { Link } from '@verdant-web/react-router';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuArrow,
  DropdownMenuItemRightSlot,
} from '@a-type/ui/components/dropdownMenu';

export interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { id, name } = hooks.useWatch(project);
  return (
    <CardRoot>
      <CardMain asChild>
        <Link to={`/project/${id}`}>
          <CardTitle>{name}</CardTitle>
        </Link>
      </CardMain>
      <CardFooter>
        <CardActions>
          <ProjectCardMenu projectId={id} />
        </CardActions>
      </CardFooter>
    </CardRoot>
  );
}

function ProjectCardMenu({ projectId }: { projectId: string }) {
  const client = hooks.useClient();

  const deleteProject = () => {
    client.projects.delete(projectId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <Icon name="dots" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuArrow />
        <DropdownMenuItem color="destructive" onClick={deleteProject}>
          Delete{' '}
          <DropdownMenuItemRightSlot>
            <Icon name="trash" />
          </DropdownMenuItemRightSlot>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
