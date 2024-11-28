import { hooks } from '@/store.js';
import {
	Button,
	CardActions,
	CardFooter,
	CardMain,
	CardRoot,
	CardTitle,
	DropdownMenu,
	DropdownMenuArrow,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemRightSlot,
	DropdownMenuTrigger,
	Icon,
} from '@a-type/ui';
import { Project } from '@star-chart.biscuits/verdant';
import { Link } from '@verdant-web/react-router';

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
