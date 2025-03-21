import { hooks } from '@/hooks.js';
import { clsx, H1, LiveUpdateTextField } from '@a-type/ui';
import { Post } from '@post.biscuits/verdant';

export interface PostTitleEditorProps {
	post: Post;
	className?: string;
	readonly?: boolean;
}

export function PostTitleEditor({
	post,
	className,
	readonly,
}: PostTitleEditorProps) {
	const { title } = hooks.useWatch(post);

	if (readonly) {
		return <H1 className={clsx('text-start', className)}>{title}</H1>;
	}

	return (
		<LiveUpdateTextField
			value={title}
			onChange={(v) => post.set('title', v)}
			className={clsx('text-start text-2xl', className)}
			autoSelect={title === 'New Post'}
			placeholder="Untitled"
		/>
	);
}
