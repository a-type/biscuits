import { PostRenderer } from '@/components/posts/PostRenderer.jsx';
import { PostTitleBlock } from '@/components/posts/PostTitleBlock.jsx';
import { Box } from '@a-type/ui';
import { HubNotebookSummaryData, HubPostData } from '../../types.js';

export interface PostRootProps {
	post: HubPostData;
	notebook: HubNotebookSummaryData;
}

export function PostRoot({ post, notebook }: PostRootProps) {
	return (
		<Box d="col" className="max-w-800px mx-auto">
			<PostTitleBlock post={post} notebook={notebook} />
			<PostRenderer body={post.body} />
		</Box>
	);
}
