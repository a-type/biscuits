import { hooks } from '@/hooks.js';
import { clsx, CollapsibleSimple, ImageUploader } from '@a-type/ui';
import { Post } from '@post.biscuits/verdant';

export interface PostCoverImageEditorProps {
	post: Post;
	className?: string;
	readonly?: boolean;
}

export function PostCoverImageEditor({
	post,
	className,
	readonly,
}: PostCoverImageEditorProps) {
	const { coverImage } = hooks.useWatch(post);
	hooks.useWatch(coverImage);
	return (
		<CollapsibleSimple open={!readonly || !!coverImage?.url}>
			{readonly ?
				<div className={clsx('w-full h-20vh', className)}>
					{coverImage?.url && (
						<img
							src={coverImage.url}
							alt="Cover"
							className="object-cover w-full h-full rounded-lg"
						/>
					)}
				</div>
			:	<ImageUploader
					className={clsx('w-full h-20vh', className)}
					value={coverImage?.url ?? null}
					onChange={(file) => post.set('coverImage', file)}
				/>
			}
		</CollapsibleSimple>
	);
}
