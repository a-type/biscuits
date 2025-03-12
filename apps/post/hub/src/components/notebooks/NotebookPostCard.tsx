import { HubPostSummaryData } from '@/types.js';
import { Card } from '@a-type/ui';

export interface NotebookPostCardProps {
	post: HubPostSummaryData;
}

export function NotebookPostCard({ post }: NotebookPostCardProps) {
	return (
		<Card>
			{post.coverImageUrl && (
				<Card.Image>
					<img
						src={post.coverImageUrl}
						className="object-cover w-full h-full"
					/>
				</Card.Image>
			)}
			<Card.Main asChild>
				<a href={post.url} className="color-inherit decoration-none">
					<Card.Title>{post.title}</Card.Title>
					<Card.Content>
						{new Date(post.updatedAt ?? post.createdAt).toDateString()}
					</Card.Content>
					{post.summary && <Card.Content>{post.summary}</Card.Content>}
				</a>
			</Card.Main>
		</Card>
	);
}
