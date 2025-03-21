import { ProjectCanvas } from '@/components/project/ProjectCanvas.jsx';
import { hooks } from '@/store.js';
import { DropdownMenuItemRightSlot, Icon } from '@a-type/ui';
import { usePageTitle } from '@biscuits/client';
import { UserMenu } from '@biscuits/client/apps';
import { useParams, useSearchParams } from '@verdant-web/react-router';

export interface ProjectPageProps {}

export function ProjectPage({}: ProjectPageProps) {
	const { projectId } = useParams();
	const project = hooks.useProject(projectId);

	const [_, setSearch] = useSearchParams();

	const showProjectSettings = () => {
		setSearch((cur) => {
			cur.set('editProject', projectId);
			return cur;
		});
	};

	usePageTitle(project?.get('name') || 'New Project');

	if (!project) {
		return <div>Not found</div>;
	}

	return (
		<div className="w-full h-full relative">
			<ProjectCanvas project={project} />
			<div className="fixed top-0 left-0 right-0 py-2 row items-center pointer-events-none">
				<UserMenu
					className="pointer-events-auto ml-auto"
					extraItems={[
						<div onClick={showProjectSettings}>
							Edit project
							<DropdownMenuItemRightSlot>
								<Icon name="new_window" />
							</DropdownMenuItemRightSlot>
						</div>,
					]}
				/>
			</div>
		</div>
	);
}

export default ProjectPage;
