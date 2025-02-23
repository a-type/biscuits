import { hooks } from '@/hooks.js';
import { getBodySnippet } from '@/utils/getBodySnippet.js';
import { Box, Card, clsx, InfiniteLoadTrigger } from '@a-type/ui';
import { Post } from '@post.biscuits/verdant';
import { Link } from '@verdant-web/react-router';

export interface PostsListProps {
	className?: string;
}

export function PostsList({ className }: PostsListProps) {
	const [items, { hasMore, loadMore }] = hooks.useAllPostsInfinite({
		index: {
			where: 'createdAt',
			order: 'desc',
		},
		pageSize: 20,
	});

	return (
		<Box className={clsx('flex-1', className)}>
			<Card.Grid columns={1} className="min-h-200px flex-1">
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
