import { HubNotebookData, HubPostSummaryData } from '@/types.js';
import { Box, Card, H1 } from '@a-type/ui';
import { RichTextRenderer } from '../richText/RichTextRenderer.jsx';
import { NotebookPostCard } from './NotebookPostCard.jsx';

export interface NotebookRendererProps {
	notebook: HubNotebookData;
	posts: HubPostSummaryData[];
}

export function NotebookRenderer({ notebook, posts }: NotebookRendererProps) {
	return (
		<Box d="col">
			{notebook.coverImageUrl && (
				<Box
					className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-30vh max-w-1920px overflow-hidden"
					p="sm"
				>
					<img
						src={notebook.coverImageUrl}
						className="w-full h-full object-cover rounded-b-lg rounded-t-sm"
					/>
				</Box>
			)}
			<Box
				className="z-1 mx-auto w-full max-w-800px"
				gap="lg"
				d="col"
				p
				items="start"
			>
				<Box surface p gap className="mt-25vh left-20px" items="center">
					{notebook.iconUrl && (
						<>
							<img
								src={notebook.iconUrl}
								className="aspect-1 w-80px rounded-md absolute -left-[20px]"
							/>
							<div className="w-50px" />
						</>
					)}
					<H1 className="text-3xl">{notebook.name}</H1>
				</Box>
				{notebook.description && (
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
