import { ImageUploader } from '@a-type/ui/components/imageUploader';
import { hooks } from '@/hooks.js';
import { useNavigate } from '@verdant-web/react-router';
import { H2 } from '@a-type/ui/components/typography';

export interface CreateProjectProps {}
export function CreateProject(props: CreateProjectProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<div className="col">
			<H2>Start a new project</H2>
			<ImageUploader
				className="h-400px w-full max-w-600px"
				onChange={async (value) => {
					if (value) {
						const project = await client.projects.put({
							image: value,
						});
						navigate(`/projects/${project.get('id')}`, {
							skipTransition: true,
						});
					}
				}}
				value={null}
			/>
		</div>
	);
}
