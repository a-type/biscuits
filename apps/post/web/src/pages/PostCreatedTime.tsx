import { hooks } from '@/hooks.js';
import { Post } from '@post.biscuits/verdant';

export interface PostCreatedTimeProps {
	post: Post;
	className?: string;
}

export function PostCreatedTime({ post, className }: PostCreatedTimeProps) {
	const { createdAt } = hooks.useWatch(post);
	return (
		<span className={className}>{new Date(createdAt).toDateString()}</span>
	);
}
