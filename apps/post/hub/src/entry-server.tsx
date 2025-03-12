import { tiptapToString } from '@post.biscuits/common';
import { Feed } from 'feed';
import ReactDOMServer from 'react-dom/server';
import 'virtual:uno.css';
import { NotebookRoot } from './pages/notebook/NotebookRoot.js';
import { PostRoot } from './pages/post/PostRoot.js';
import {
	HubNotebookData,
	HubNotebookSummaryData,
	HubPostData,
	HubPostSummaryData,
} from './types.js';

export type * from './types.js';

export function serverRenderNotebook(props: {
	notebook: HubNotebookData;
	posts: HubPostSummaryData[];
}): string {
	return ReactDOMServer.renderToStaticMarkup(<NotebookRoot {...props} />);
}

export function serverRenderPost(props: {
	post: HubPostData;
	notebook: HubNotebookSummaryData;
}): string {
	return ReactDOMServer.renderToStaticMarkup(<PostRoot {...props} />);
}

type NotebookFeedProps = {
	notebook: HubNotebookData;
	posts: HubPostData[];
	categories?: string[];
};

function createFeed(props: NotebookFeedProps) {
	const feed = new Feed({
		title: props.notebook.name,
		description:
			props.notebook.description ?
				tiptapToString(props.notebook.description)
			:	undefined,
		id: props.notebook.url,
		link: props.notebook.url,
		image: props.notebook.iconUrl ?? undefined,
		updated: new Date(props.notebook.updatedAt || props.notebook.createdAt),
		generator: 'Biscuits Post',
		feedLinks: {
			atom: props.notebook.url + '/atom.xml',
		},
		author: {
			name: props.notebook.authorName,
		},
		copyright: `© ${new Date(props.notebook.updatedAt || props.notebook.createdAt).getFullYear()} ${props.notebook.authorName}`,
	});

	for (const category of props.categories ?? []) {
		feed.addCategory(category);
	}

	for (const post of props.posts) {
		feed.addItem({
			title: post.title,
			id: post.id,
			date: new Date(post.updatedAt || post.createdAt),
			link: `${post.url}`,
			content: serverRenderPost({ post, notebook: props.notebook }),
			author: [{ name: post.authorName }],
			copyright: `© ${new Date(post.updatedAt || post.createdAt).getFullYear()} ${post.authorName}`,
			image: post.coverImageUrl ?? undefined,
			published: new Date(post.createdAt),
		});
	}

	return feed;
}

export function serverRenderAtom(props: NotebookFeedProps) {
	return createFeed(props).atom1();
}
