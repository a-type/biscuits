import { hooks } from '@/hooks.js';
import { Button, ButtonProps } from '@a-type/ui';
import { useNavigate } from '@verdant-web/react-router';

export interface CreatePostButtonProps extends ButtonProps {}
export function CreatePostButton({
	onClick,
	children,
	...rest
}: CreatePostButtonProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<Button
			onClick={async (ev) => {
				const post = await client.posts.put({
					title: `New Post`,
				});
				onClick?.(ev);
				navigate(`/posts/${post.get('id')}`);
			}}
			{...rest}
		>
			{children || 'New Post'}
		</Button>
	);
}
