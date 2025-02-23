import { hooks } from '@/hooks.js';
import { getBodySnippet } from '@/utils/getBodySnippet.js';
import { Box, Card, clsx, Icon, InfiniteLoadTrigger } from '@a-type/ui';
import { Post } from '@post.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import { CreatePostButton } from './CreatePostButton.jsx';

export interface PostsListProps {
	className?: string;
	notebookId: string | null;
}

export function PostsList({ className, notebookId }: PostsListProps) {
	const [items, { hasMore, loadMore }] = hooks.useAllPostsInfinite({
		index: {
			where: 'notebookId_createdAt',
			match: {
				notebookId,
			},
			order: 'desc',
		},
		pageSize: 20,
	});

	return (
		<Box className={clsx('flex-1', className)}>
			<Card.Grid columns={1} className="min-h-200px flex-1">
				<CreatePostButton
					notebookId={notebookId}
					className="w-full justify-center"
				>
					<Icon name="plus" /> New Post
				</CreatePostButton>
				{items.map((item, i) => (
					<PostsListItem item={item} key={i} />
				))}
			</Card.Grid>
			{hasMore && <InfiniteLoadTrigger onVisible={loadMore} />}
		</Box>
	);
}

function PostsListItem({ item }: { item: Post }) {
	const { title, createdAt, body, id } = hooks.useWatch(item);
	const snippet = getBodySnippet(body);

	return (
		<Card className="min-h-10vh">
			<Card.Main asChild>
				<Link to={`/posts/${id}`}>
					<Card.Title>{title}</Card.Title>
					<Card.Content>{new Date(createdAt).toDateString()}</Card.Content>
					<Card.Content>{snippet}</Card.Content>
				</Link>
			</Card.Main>
		</Card>
	);
}
