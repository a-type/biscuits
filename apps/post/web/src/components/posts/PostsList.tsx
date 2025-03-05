import { hooks } from '@/hooks.js';
import { getBodySnippet } from '@/utils/getBodySnippet.js';
import { Box, Card, clsx, InfiniteLoadTrigger } from '@a-type/ui';
import { Post } from '@post.biscuits/verdant';
import { Link } from '@verdant-web/react-router';

export interface PostsListProps {
	className?: string;
	notebookId?: string | null;
}

export function PostsList({ className, notebookId }: PostsListProps) {
	const [items, { hasMore, loadMore }] = hooks.useAllPostsInfinite({
		index:
			notebookId ?
				{
					where: 'notebookId_createdAt',
					match: {
						notebookId,
					},
					order: 'desc',
				}
			:	{
					order: 'desc',
					where: 'createdAt',
				},
		pageSize: 20,
		key: `posts-${notebookId}`,
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
	const { title, createdAt, body, id, coverImage } = hooks.useWatch(item);
	const snippet = getBodySnippet(body);
	hooks.useWatch(coverImage);

	return (
		<Card className="min-h-10vh">
			{coverImage?.url && (
				<Card.Image>
					<img src={coverImage.url} className="w-full h-full object-cover" />
				</Card.Image>
			)}
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
