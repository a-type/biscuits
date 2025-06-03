import { hooks } from '@/hooks.js';
import { clsx, LiveUpdateTextField, P } from '@a-type/ui';
import { Post } from '@post.biscuits/verdant';

export interface PostSummaryEditorProps {
	post: Post;
	readonly?: boolean;
}

export function PostSummaryEditor({ post, readonly }: PostSummaryEditorProps) {
	const { summary } = hooks.useWatch(post);

	if (readonly) {
		return (
			<P
				className={clsx(
					'text-xs color-gray-dark whitespace-pre leading-relaxed w-full text-wrap',
				)}
			>
				{summary || 'Add a post summary'}
			</P>
		);
	}

	return (
		<LiveUpdateTextField
			textArea
			placeholder="Add a post summary"
			className="text-sm"
			value={summary || ''}
			onChange={(v) => post.set('summary', v)}
		/>
	);
}
