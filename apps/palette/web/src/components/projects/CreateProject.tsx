import { hooks } from '@/hooks.js';
import { H2, ImageUploader } from '@a-type/ui';
import { useNavigate } from '@tanstack/react-router';

export interface CreateProjectProps {}
export function CreateProject(props: CreateProjectProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<div className="col" {...props}>
			<H2>Start a new project</H2>
			<ImageUploader
				style={{ height: 400, maxWidth: 600, width: '100%' }}
				onChange={async (value) => {
					if (value) {
						const project = await client.projects.put({
							image: value,
						});
						navigate({
							to: `/projects/${project.get('id')}`,
							viewTransition: false,
						});
					}
				}}
				value={null}
			/>
		</div>
	);
}
