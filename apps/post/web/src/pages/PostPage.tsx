import { PostCoverImageEditor } from '@/components/posts/PostCoverImageEditor.jsx';
import { PostEditor } from '@/components/posts/PostEditor.jsx';
import { PostPublishControl } from '@/components/posts/PostPublishControl.jsx';
import { PostTitleEditor } from '@/components/posts/PostTitleEditor.jsx';
import { hooks } from '@/hooks.js';
import { Box, Button, ErrorBoundary, Icon } from '@a-type/ui';
import { Link, useParams } from '@verdant-web/react-router';
import { PostCreatedTime } from './PostCreatedTime.jsx';

export interface PostPageProps {}

export function PostPage({}: PostPageProps) {
	const { id } = useParams();
	const post = hooks.usePost(id);

	if (!post) {
		return <div>Post not found</div>;
	}

	return (
		<Box p className="bg-white flex-1" d="col">
			<Box d="col" gap container className="max-w-650px w-full mx-auto flex-1">
				<Box d="row" justify="between" p="sm">
					<HomeButton notebookId={post.get('notebookId')} />
					<ErrorBoundary fallback={null}>
						<PostPublishControl post={post} />
					</ErrorBoundary>
				</Box>
				<PostCoverImageEditor post={post} className="w-full h-20vh" />
				<PostTitleEditor post={post} className="text-2xl -mx-4" />
				<Box d="col" items="start" className="px-2">
					<PostCreatedTime post={post} className="text-xs color-gray-dark" />
					{/* <PostNotebookEditor post={post} /> */}
				</Box>
				<PostEditor post={post} className="flex-1" />
			</Box>
		</Box>
	);
}

function HomeButton({ notebookId }: { notebookId: string | null }) {
	return (
		<Button color="default" size="icon" asChild>
			<Link to={notebookId ? `/notebooks/${notebookId}` : '/'}>
				<Icon name="arrowLeft" />
			</Link>
		</Button>
	);
}

export default PostPage;
