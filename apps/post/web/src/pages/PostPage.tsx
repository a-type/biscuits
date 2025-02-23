import { PostCoverImageEditor } from '@/components/posts/PostCoverImageEditor.jsx';
import { PostEditor } from '@/components/posts/PostEditor.jsx';
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
			<HomeButton />
			<Box d="col" gap container className="max-w-650px w-full mx-auto flex-1">
				<PostCoverImageEditor post={post} className="w-full h-20vh" />
				<Box gap items="center">
					<PostTitleEditor post={post} className="text-xl flex-1 ml-[14px]" />
				</Box>
				<PostEditor post={post} className="flex-1" />
			</Box>
		</Box>
	);
}

function HomeButton() {
	return (
		<Button
			color="default"
			size="icon"
			asChild
			className="fixed top-4 left-4 z-menu"
		>
			<Link to="/">
				<Icon name="arrowLeft" />
			</Link>
		</Button>
	);
}

export default PostPage;
