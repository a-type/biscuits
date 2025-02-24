import { hooks } from '@/hooks.js';
import { Box, Card, Icon, InfiniteLoadTrigger } from '@a-type/ui';
import { Notebook } from '@post.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import { Suspense } from 'react';
import { CreateNotebookButton } from './CreateNotebookButton.jsx';

export interface NotebooksListProps {
	className?: string;
}

export function NotebooksList({ className }: NotebooksListProps) {
	const [items, { hasMore, loadMore }] = hooks.useAllNotebooksInfinite({
		index: {
			where: 'name',
			order: 'asc',
		},
		pageSize: 10,
	});

	return (
		<Box className={className}>
			<Card.Grid
				className="w-full"
				columns={(w) => Math.max(1, Math.floor(w / 150))}
			>
				<CreateNotebookButton className="aspect-1 items-center justify-center">
					<Icon name="plus" className="w-30px h-30px" />
				</CreateNotebookButton>
				{items.map((item, i) => (
					<NotebooksListItem item={item} key={i} />
				))}
			</Card.Grid>
			{hasMore && <InfiniteLoadTrigger onVisible={loadMore} />}
		</Box>
	);
}

function NotebooksListItem({ item }: { item: Notebook }) {
	const { name, id, coverImage, icon } = hooks.useWatch(item);
	return (
		<Card>
			<Card.Main asChild className="aspect-1 w-full">
				<Link to={`/notebooks/${id}`}>
					{coverImage?.url && (
						<Card.Image>
							<img
								src={coverImage.url}
								className="w-full h-full object-cover"
							/>
						</Card.Image>
					)}
					<Card.Title className="flex flex-row gap-sm">
						{icon?.url && <img src={icon.url} className="w-8 h-8 rounded-sm" />}
						{name}
					</Card.Title>
					<Suspense fallback={<Card.Content>Loading...</Card.Content>}>
						<PostsSummary notebook={item} />
					</Suspense>
				</Link>
			</Card.Main>
		</Card>
	);
}

function PostsSummary({ notebook }: { notebook: Notebook }) {
	const posts = hooks.useAllPosts({
		index: {
			where: 'notebookId',
			equals: notebook.get('id'),
		},
	});

	return <Card.Content>{posts.length} posts</Card.Content>;
}
