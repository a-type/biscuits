import { NotebookRenderer } from '@/components/notebooks/NotebookRenderer.jsx';
import { HubNotebookData, HubPostSummaryData } from '../../types.js';

export interface NotebookRootProps {
	notebook: HubNotebookData;
	posts: HubPostSummaryData[];
}

export function NotebookRoot(props: NotebookRootProps) {
	return <NotebookRenderer {...props} />;
}
