import { hooks } from '@/store.js';
import {
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	LiveUpdateTextField,
} from '@a-type/ui';
import { useSearchParams } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface ProjectSettingsDialogProps {}

export function ProjectSettingsDialog({}: ProjectSettingsDialogProps) {
	const [search, setSearch] = useSearchParams();
	const projectId = search.get('editProject');

	return (
		<Dialog
			open={!!projectId}
			onOpenChange={(open) => {
				if (!open)
					setSearch((cur) => {
						cur.delete('editProject');
						return cur;
					});
			}}
		>
			<DialogContent>
				<Suspense>
					{projectId && <ProjectSettings projectId={projectId} />}
				</Suspense>
				<DialogActions>
					<DialogClose asChild>
						<Button>Done</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}

function ProjectSettings({ projectId }: { projectId: string }) {
	const project = hooks.useProject(projectId);
	hooks.useWatch(project);

	if (!project) {
		return <div>Project not found</div>;
	}

	return (
		<div className="col items-stretch">
			<LiveUpdateTextField
				value={project.get('name')}
				onChange={(v) => project.set('name', v)}
			/>
		</div>
	);
}
