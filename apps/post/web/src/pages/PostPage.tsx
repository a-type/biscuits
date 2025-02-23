import { PostCoverImageEditor } from '@/components/posts/PostCoverImageEditor.jsx';
import { PostEditor } from '@/components/posts/PostEditor.jsx';
import { PostNotebookEditor } from '@/components/posts/PostNotebookEditor.jsx';
import { PostTitleEditor } from '@/components/posts/PostTitleEditor.jsx';
import { hooks } from '@/hooks.js';
import { Box, Button, Icon } from '@a-type/ui';
import { Link, useParams } from '@verdant-web/react-router';

export interface PostPageProps {}

export function PostPage({}: PostPageProps) {
	const { id } = useParams();
	const post = hooks.usePost(id);

	if (!post) {
		return <div>Post not found</div>;
	}

	return (
		<Box p className="bg-white flex-1" d="col">
			<HomeButton notebookId={post.get('notebookId')} />
			<Box d="col" gap container className="max-w-650px w-full mx-auto flex-1">
				<PostCoverImageEditor post={post} className="w-full h-20vh" />
				<PostTitleEditor post={post} className="text-xl ml-[14px]" />
				<Box className="ml-[20px]" d="col" items="start">
					<PostNotebookEditor post={post} />
				</Box>
				<PostEditor post={post} className="flex-1" />
			</Box>
		</Box>
	);
}

function HomeButton({ notebookId }: { notebookId: string | null }) {
	return (
		<Button
			color="default"
			size="icon"
			asChild
			className="fixed top-4 left-4 z-menu"
		>
			<Link to={notebookId ? `/notebooks/${notebookId}` : '/'}>
				<Icon name="arrowLeft" />
			</Link>
		</Button>
	);
}

export default PostPage;
