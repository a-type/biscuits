import { hooks } from '@/store.js';
import { Button, ButtonProps } from '@a-type/ui';
import { useNavigate } from '@verdant-web/react-router';
import { useState } from 'react';

export interface CreateProjectButtonProps extends ButtonProps {
	redirect?: boolean;
}

export function CreateProjectButton({
	children,
	redirect,
	...props
}: CreateProjectButtonProps) {
	const [loading, setLoading] = useState(false);
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<Button
			{...props}
			onClick={async () => {
				setLoading(true);
				const project = await client.projects.put({
					name: 'New Project',
				});
				setLoading(false);
				if (redirect) {
					navigate(`/projects/${project.get('id')}`, {
						skipTransition: true,
					});
				}
			}}
			loading={loading}
		>
			{children ?? 'New Project'}
		</Button>
	);
}
