import { hooks } from '@/store.js';
import { Button, ButtonProps } from '@a-type/ui';
import { useNavigate } from '@verdant-web/react-router';

export interface CreateSingleTaskButtonProps extends ButtonProps {}

export function CreateSingleTaskButton({
	...rest
}: CreateSingleTaskButtonProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<Button
			onClick={async () => {
				const task = await client.tasks.put({
					content: '',
				});
				navigate(`/task/${task.get('id')}`, { skipTransition: true });
			}}
		>
			New one-off
		</Button>
	);
}
