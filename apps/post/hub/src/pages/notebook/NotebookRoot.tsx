import { HubNotebookData, HubPostSummaryData } from '../../types.js';

export interface NotebookRootProps {
	notebook: HubNotebookData;
	posts: HubPostSummaryData[];
}

export function NotebookRoot({ notebook, posts }: NotebookRootProps) {
	return (
		<div>
			Todo: Notebook {notebook.name}: {posts.length} posts
		</div>
	);
}
