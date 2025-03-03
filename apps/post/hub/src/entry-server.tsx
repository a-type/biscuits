import ReactDOMServer from 'react-dom/server';
import 'virtual:uno.css';
import { NotebookRoot } from './pages/notebook/NotebookRoot.js';
import { PostRoot } from './pages/post/PostRoot.js';
import { HubNotebookData, HubPostData, HubPostSummaryData } from './types.js';

export type * from './types.js';

export function serverRenderNotebook(props: {
	notebook: HubNotebookData;
	posts: HubPostSummaryData[];
}): string {
	return ReactDOMServer.renderToStaticMarkup(<NotebookRoot {...props} />);
}

export function serverRenderPost(props: {
	post: HubPostData;
	notebook: HubNotebookData;
}): string {
	return ReactDOMServer.renderToStaticMarkup(<PostRoot {...props} />);
}
