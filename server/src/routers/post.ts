import { db, PublishedNotebook, sql } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import { getLibraryName } from '@biscuits/libraries';
import { attachFileUrls } from '@verdant-web/tiptap/server';
import { readFile } from 'fs/promises';
import { Hono } from 'hono';
import path from 'path';
import { renderTemplate, staticFile } from '../common/hubs.js';
import { POST_HUB_ORIGIN } from '../config/deployedContext.js';
import { Env } from '../config/hono.js';
import { verdantServer } from '../verdant/verdant.js';

export const postRouter = new Hono<Env>();

const hubPath = path.join(process.cwd(), '..', 'apps', 'post', 'hub', 'dist');
const hubClientPath = path.join(hubPath, 'client');

postRouter.get('/hub/assets/*', ({ req }) =>
	staticFile(hubClientPath, 'post/hub', req.raw),
);
postRouter.get('/hub/favicon.ico', ({ req }) =>
	staticFile(hubClientPath, 'post/hub', req.raw),
);

function addPostUrl<T extends { slug: string }>(
	post: T,
	notebookId: string,
	customDomain: string | undefined,
) {
	return {
		...post,
		url: `${customDomain || `${POST_HUB_ORIGIN}/${notebookId}`}/${post.slug}`,
	};
}

function addNotebookUrl<T extends { id: string }>(
	notebook: T,
	customDomain: string | undefined,
) {
	return {
		...notebook,
		url: customDomain || `${POST_HUB_ORIGIN}/${notebook.id}`,
	};
}

async function processPost(post: any, planId: string) {
	await attachFileUrls(
		post.body,
		getLibraryName({ planId, app: 'post' }),
		verdantServer,
	);
	return post;
}

function getNotebookGlobalStyle(notebook: Pick<PublishedNotebook, 'theme'>) {
	return {
		theme: notebook.theme?.primaryColor ?? 'blueberry',
		globalStyle: `:root:root {
					--global-spacing-scale: ${
						notebook.theme?.spacing === 'sm' ? '0.5'
						: notebook.theme?.spacing === 'lg' ? '2'
						: '1'
					};
					--font-default: ${notebook.theme?.fontStyle === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)'};
					--font-title: var(--font-default);
					--global-corner-scale: ${notebook.theme?.corners === 'square' ? '0.25' : '1'};
				}`,
	};
}

postRouter.get('/hub/:notebookId', async (ctx) => {
	const notebookId = ctx.req.param('notebookId');

	const notebook = await db
		.selectFrom('PublishedNotebook')
		.where('PublishedNotebook.id', '=', notebookId)
		.innerJoin('User', 'PublishedNotebook.publishedBy', 'User.id')
		.selectAll('PublishedNotebook')
		.select([
			'User.id as authorId',
			sql<string>`COALESCE(User.friendlyName, User.fullName)`.as('authorName'),
			'User.imageUrl as authorAvatarUrl',
		])
		.executeTakeFirstOrThrow(
			() =>
				new BiscuitsError(BiscuitsError.Code.NotFound, 'Notebook not found'),
		);

	const posts = await db
		.selectFrom('PublishedPost')
		.where('notebookId', '=', notebookId)
		.innerJoin('User', 'PublishedPost.publishedBy', 'User.id')
		.select([
			'PublishedPost.id',
			'PublishedPost.slug',
			'PublishedPost.summary',
			'PublishedPost.title',
			'PublishedPost.coverImageUrl',
			'PublishedPost.createdAt',
			'PublishedPost.updatedAt',
			'User.id as authorId',
			sql<string>`COALESCE(User.friendlyName, User.fullName)`.as('authorName'),
			'User.imageUrl as authorAvatarUrl',
		])
		.limit(20)
		.orderBy('PublishedPost.createdAt', 'desc')
		.execute();

	const indexTemplate = await readFile(
		path.join(hubClientPath, 'src/pages/notebook/index.html'),
		'utf8',
	);

	const customDomain = ctx.get('customDomain');
	const data = {
		notebook: addNotebookUrl(notebook, customDomain),
		posts: posts.map((post) => addPostUrl(post, notebookId, customDomain)),
	};

	const { serverRenderNotebook } = await import('@post.biscuits/hub');
	const appHtml = serverRenderNotebook(data);
	const { theme, globalStyle } = getNotebookGlobalStyle(notebook);
	return renderTemplate(indexTemplate, {
		appHtml,
		data,
		theme,
		globalStyle,
		title: notebook.name,
	});
});

postRouter.get('/hub/:notebookId/atom.xml', async (ctx) => {
	const notebookId = ctx.req.param('notebookId');

	const notebook = await db
		.selectFrom('PublishedNotebook')
		.where('PublishedNotebook.id', '=', notebookId)
		.innerJoin('User', 'PublishedNotebook.publishedBy', 'User.id')
		.selectAll('PublishedNotebook')
		.select([
			'User.id as authorId',
			sql<string>`COALESCE(User.friendlyName, User.fullName)`.as('authorName'),
			'User.imageUrl as authorAvatarUrl',
		])
		.executeTakeFirstOrThrow(
			() =>
				new BiscuitsError(BiscuitsError.Code.NotFound, 'Notebook not found'),
		);

	const posts = await db
		.selectFrom('PublishedPost')
		.where('notebookId', '=', notebookId)
		.innerJoin('User', 'PublishedPost.publishedBy', 'User.id')
		.select([
			'PublishedPost.id',
			'PublishedPost.slug',
			'PublishedPost.summary',
			'PublishedPost.title',
			'PublishedPost.coverImageUrl',
			'PublishedPost.body',
			'PublishedPost.createdAt',
			'PublishedPost.updatedAt',
			'User.id as authorId',
			sql<string>`COALESCE(User.friendlyName, User.fullName)`.as('authorName'),
			'User.imageUrl as authorAvatarUrl',
		])
		.limit(20)
		.orderBy('PublishedPost.createdAt', 'desc')
		.execute();

	const { serverRenderAtom } = await import('@post.biscuits/hub');
	const customDomain = ctx.get('customDomain');

	return ctx.body(
		serverRenderAtom({
			notebook: addNotebookUrl(notebook, customDomain),
			posts: await Promise.all(
				posts
					.map((post) => addPostUrl(post, notebookId, customDomain))
					.map((post) => processPost(post, notebook.planId)),
			),
		}),
		200,
		{
			'Content-Type': 'application/atom+xml',
		},
	);
});

postRouter.get('/hub/:notebookId/:postSlug', async (ctx) => {
	const notebookId = ctx.req.param('notebookId');
	const slug = ctx.req.param('postSlug');

	const post = await db
		.selectFrom('PublishedPost')
		.where('notebookId', '=', notebookId)
		.where('slug', '=', slug)
		.innerJoin('User', 'PublishedPost.publishedBy', 'User.id')
		.selectAll('PublishedPost')
		.select([
			'User.id as authorId',
			sql<string>`COALESCE(User.friendlyName, User.fullName)`.as('authorName'),
			'User.imageUrl as authorAvatarUrl',
		])
		.executeTakeFirstOrThrow(
			() => new BiscuitsError(BiscuitsError.Code.NotFound, 'Post not found'),
		);

	const notebook = await db
		.selectFrom('PublishedNotebook')
		.where('id', '=', notebookId)
		.select([
			'id',
			'name',
			'coverImageUrl',
			'iconUrl',
			'createdAt',
			'updatedAt',
			'planId',
			'theme',
		])
		.executeTakeFirstOrThrow(
			() =>
				new BiscuitsError(BiscuitsError.Code.NotFound, 'Notebook not found'),
		);

	const customDomain = ctx.get('customDomain');
	const postWithUrl = await processPost(
		addPostUrl(post, notebookId, customDomain),
		notebook.planId,
	);
	const data = {
		post: postWithUrl,
		notebook: addNotebookUrl(notebook, customDomain),
	};

	const indexTemplate = await readFile(
		path.join(hubClientPath, 'src/pages/post/index.html'),
		'utf8',
	);

	const { serverRenderPost } = await import('@post.biscuits/hub');
	const appHtml = serverRenderPost(data);
	const { theme, globalStyle } = getNotebookGlobalStyle(notebook);
	console.log(theme, globalStyle);
	return renderTemplate(indexTemplate, {
		appHtml,
		data,
		theme,
		globalStyle,
		title: `${post.title} | ${notebook.name}`,
	});
});

postRouter.get('/hub/*', ({ req }) =>
	staticFile(hubClientPath, 'post/hub', req.raw),
);
