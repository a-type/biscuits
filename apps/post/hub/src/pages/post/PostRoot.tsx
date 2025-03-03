import { PostRenderer } from '@/components/posts/PostRenderer.jsx';
import { Box, H1 } from '@a-type/ui';
import { HubNotebookSummaryData, HubPostData } from '../../types.js';

export interface PostRootProps {
	post: HubPostData;
	notebook: HubNotebookSummaryData;
}

export function PostRoot({ post, notebook }: PostRootProps) {
	return (
		<Box d="col">
			<H1>{post.title}</H1>
			<PostRenderer body={post.body} />
		</Box>
	);
}
