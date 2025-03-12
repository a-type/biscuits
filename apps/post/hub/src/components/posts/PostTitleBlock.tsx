import { HubNotebookSummaryData, HubPostData } from '@/types.js';
import { Avatar, Box, Button, H1 } from '@a-type/ui';

export interface PostTitleBlockProps {
	post: HubPostData;
	notebook: HubNotebookSummaryData;
}

export function PostTitleBlock({ post, notebook }: PostTitleBlockProps) {
	return (
		<Box
			p
			d="col"
			className="min-h-30vh max-w-1920px bg-primary-wash rounded-lg overflow-hidden m-sm"
			justify="between"
			items="start"
			container
		>
			{post.coverImageUrl && (
				<img
					src={post.coverImageUrl}
					className="absolute w-full h-full inset-0 object-cover"
				/>
			)}
			<Box d="row" gap items="center" surface>
				<Button asChild color="ghost" className="pl-0 py-0 pr-md gap-md">
					<a href={notebook.url}>
						{notebook.iconUrl && (
							<img
								src={notebook.iconUrl}
								className="h-32px aspect-1 rounded-md object-cover"
							/>
						)}
						<h2 className="text-sm m-0">{notebook.name}</h2>
					</a>
				</Button>
			</Box>
			<Box gap d="col" items="start">
				<Box surface p>
					<H1>{post.title}</H1>
				</Box>
				<Box surface p d="col" className="text-xs text-gray-dark" gap>
					<div>
						Published{' '}
						{new Date(post.updatedAt ?? post.createdAt).toDateString()}
					</div>
					<div>
						By{' '}
						{post.authorAvatarUrl ?
							<Avatar imageSrc={post.authorAvatarUrl} />
						:	null}{' '}
						{post.authorName}
					</div>
				</Box>
			</Box>
		</Box>
	);
}
