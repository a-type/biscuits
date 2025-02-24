import { hooks } from '@/hooks.js';
import { Button, ButtonProps } from '@a-type/ui';
import { useNavigate } from '@verdant-web/react-router';
import { authorization } from '@verdant-web/store';

export interface CreatePostButtonProps extends ButtonProps {
	notebookId?: string | null;
}
export function CreatePostButton({
	onClick,
	children,
	notebookId,
	...rest
}: CreatePostButtonProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<Button
			onClick={async (ev) => {
				const post = await client.posts.put(
					{
						title: `New Post`,
						notebookId,
					},
					{
						access: authorization.private,
					},
				);
				onClick?.(ev);
				navigate(`/posts/${post.get('id')}`);
			}}
			{...rest}
		>
			{children || 'New Post'}
		</Button>
	);
}
