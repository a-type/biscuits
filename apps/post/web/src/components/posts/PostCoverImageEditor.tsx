import { hooks } from '@/hooks.js';
import { clsx, ImageUploader } from '@a-type/ui';
import { Post } from '@post.biscuits/verdant';

export interface PostCoverImageEditorProps {
	post: Post;
	className?: string;
}

export function PostCoverImageEditor({
	post,
	className,
}: PostCoverImageEditorProps) {
	const { coverImage } = hooks.useWatch(post);
	hooks.useWatch(coverImage);
	return (
		<ImageUploader
			className={clsx('w-full h-20vh', className)}
			value={coverImage?.url ?? null}
			onChange={(file) => post.set('coverImage', file)}
		/>
	);
}
