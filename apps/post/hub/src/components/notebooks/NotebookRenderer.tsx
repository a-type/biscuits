import { HubNotebookData, HubPostSummaryData } from '@/types.js';
import { Box, Card, H1 } from '@a-type/ui';
import { tiptapToString } from '@post.biscuits/common';
import { RichTextRenderer } from '../richText/RichTextRenderer.jsx';
import { NotebookPostCard } from './NotebookPostCard.jsx';

export interface NotebookRendererProps {
	notebook: HubNotebookData;
	posts: HubPostSummaryData[];
}

export function NotebookRenderer({ notebook, posts }: NotebookRendererProps) {
	const descriptionIsEmpty =
		!notebook.description || tiptapToString(notebook.description) === '';
	return (
		<Box d="col">
			{notebook.coverImageUrl && (
				<Box
					className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-40vh max-w-1920px overflow-hidden"
					p={{ default: 'xs', md: 'sm' }}
				>
					<img
						src={notebook.coverImageUrl}
						className="w-full h-full object-cover rounded-b-lg rounded-t-sm"
					/>
					{notebook.iconUrl && (
						<div className="absolute top-md left-md">
							<img
								src={notebook.iconUrl}
								className="aspect-1 w-80px rounded-md absolute"
							/>
						</div>
					)}
				</Box>
			)}
			<Box
				className="z-1 mx-auto w-full max-w-800px"
				gap="lg"
				d="col"
				p
				items="start"
			>
				<Box surface p gap className="mt-25vh" items="center">
					<H1 className="text-3xl">{notebook.name}</H1>
				</Box>
				{!!notebook.description && !descriptionIsEmpty && (
					<Box surface p>
						<RichTextRenderer content={notebook.description} />
					</Box>
				)}
				<Card.Grid className="w-full min-h-70vh">
					{posts.map((post) => (
						<NotebookPostCard key={post.id} post={post} />
					))}
				</Card.Grid>
				<Box surface p className="text-sm w-full text-gray" gap d="col">
					<div>
						©{' '}
						{new Date(notebook.updatedAt ?? notebook.createdAt).getFullYear()}{' '}
						{notebook.authorName}
					</div>
					<div>
						Website powered by{' '}
						<a className="font-bold" href="https://post.biscuits.club">
							Biscuits Post
						</a>
					</div>
				</Box>
			</Box>
		</Box>
	);
}
