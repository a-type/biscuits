import { PostDetailsEditor } from '@/components/posts/PostDetailsEditor.jsx';
import { PostEditor } from '@/components/posts/PostEditor.jsx';
import { PostPublishControl } from '@/components/posts/PostPublishControl.jsx';
import { Themed } from '@/components/Themed.jsx';
import { hooks } from '@/hooks.js';
import {
	Box,
	Button,
	ErrorBoundary,
	Icon,
	withClassName,
	withProps,
} from '@a-type/ui';
import { usePageTitle } from '@biscuits/client';
import { Post } from '@post.biscuits/verdant';
import { Link, useParams } from '@verdant-web/react-router';
import { ReactNode, Suspense } from 'react';
import { PostCreatedTime } from './PostCreatedTime.jsx';

export interface PostPageProps {}

export function PostPage({}: PostPageProps) {
	const { id } = useParams();
	const post = hooks.usePost(id);

	usePageTitle(post?.get('title') || 'Not found');

	if (!post) {
		return <div>Post not found</div>;
	}

	return (
		<ThemedRoot post={post}>
			<Box d="col" gap container className="max-w-650px w-full mx-auto flex-1">
				<Box d="row" justify="between" p="sm">
					<HomeButton notebookId={post.get('notebookId')} />
					<ErrorBoundary fallback={null}>
						<Suspense>
							<PostPublishControl post={post} />
						</Suspense>
					</ErrorBoundary>
				</Box>
				<PostDetailsEditor post={post} />
				<Box d="col" items="start" className="px-2">
					<PostCreatedTime post={post} className="text-xs color-gray-dark" />
					{/* <PostNotebookEditor post={post} /> */}
				</Box>
				<PostEditor post={post} className="flex-1" />
			</Box>
		</ThemedRoot>
	);
}

export const Root = withClassName(
	withProps(Box, {
		p: true,
		d: 'col',
	}),
	'bg-white flex-1',
);

function ThemedRoot({ post, children }: { post: Post; children?: ReactNode }) {
	const { notebookId } = hooks.useWatch(post);
	if (!notebookId) return <Root>{children}</Root>;
	return (
		<Themed notebookId={notebookId} asChild>
			<Root>{children}</Root>
		</Themed>
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
