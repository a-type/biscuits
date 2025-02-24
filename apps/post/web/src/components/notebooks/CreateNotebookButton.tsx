import { hooks } from '@/hooks.js';
import { Button, ButtonProps } from '@a-type/ui';
import { useNavigate } from '@verdant-web/react-router';
import { authorization } from '@verdant-web/store';

export interface CreateNotebookButtonProps extends ButtonProps {}
export function CreateNotebookButton({
	children,
	onClick,
	...rest
}: CreateNotebookButtonProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<Button
			onClick={async (ev) => {
				const notebook = await client.notebooks.put(
					{
						name: 'New Notebook',
					},
					{
						access: authorization.private,
					},
				);
				onClick?.(ev);
				navigate(`/notebooks/${notebook.get('id')}`);
			}}
			{...rest}
		>
			{children || 'New Notebook'}
		</Button>
	);
}
