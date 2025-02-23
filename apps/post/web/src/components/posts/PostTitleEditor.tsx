import { hooks } from '@/hooks.js';
import { clsx, EditableText } from '@a-type/ui';
import { Post } from '@post.biscuits/verdant';

export interface PostTitleEditorProps {
	post: Post;
	className?: string;
}

export function PostTitleEditor({ post, className }: PostTitleEditorProps) {
	const { title } = hooks.useWatch(post);

	return (
		<EditableText
			value={title}
			onValueChange={(v) => post.set('title', v)}
			className={clsx('text-start', className)}
			autoSelect
		/>
	);
}
