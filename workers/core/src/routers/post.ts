import { createDb, PublishedNotebook, sql } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import { getLibraryName } from '@biscuits/libraries';
import { LibraryApi } from '@verdant-web/server';
import { attachFileUrls } from '@verdant-web/tiptap/server';
import { Context, Hono } from 'hono';
import { renderTemplate, staticFile } from '../common/hubs.js';
import { HonoEnv } from '../config/hono.js';

export const postRouter = new Hono<HonoEnv>();

postRouter.get('/hub/assets/*', (ctx) =>
	staticFile('post', 'client', ctx, 'post/hub'),
);
postRouter.get('/hub/favicon.ico', (ctx) =>
	staticFile('post', 'client', ctx, 'post/hub'),
);

function addPostUrl<T extends { slug: string }>(
	post: T,
	notebookId: string,
	customDomain: string | undefined,
	ctx: Context<HonoEnv>,
) {
	const postUrl =
		customDomain ?
			`https://${customDomain}/${post.slug}`
		:	`${ctx.env.POST_HUB_ORIGIN}/${notebookId}/${post.slug}`;
	return {
		...post,
		url: postUrl,
	};
}

function addNotebookUrl<T extends { id: string }>(
	notebook: T,
	customDomain: string | undefined,
	ctx: Context<HonoEnv>,
) {
	return {
		...notebook,
		url: customDomain || `${ctx.env.POST_HUB_ORIGIN}/${notebook.id}`,
	};
}

async function processPost(post: any, planId: string, library: LibraryApi) {
	await attachFileUrls(
		post.body,
		getLibraryName({ planId, app: 'post' }),
		library,
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

	const db = createDb(ctx.env.CORE_DB);
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

	const customDomain = ctx.get('customDomain');
	const data = {
		notebook: addNotebookUrl(notebook, customDomain, ctx),
		posts: posts.map((post) => addPostUrl(post, notebookId, customDomain, ctx)),
	};

	const { serverRenderNotebook } = await import('@post.biscuits/hub');
	const appHtml = serverRenderNotebook(data);
	const { theme, globalStyle } = getNotebookGlobalStyle(notebook);
	return renderTemplate('post', ctx, {
		appHtml,
		data,
		theme,
		globalStyle,
		title: notebook.name,
	});
});

postRouter.get('/hub/:notebookId/atom.xml', async (ctx) => {
	const notebookId = ctx.req.param('notebookId');

	const db = createDb(ctx.env.CORE_DB);
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

	const library = await ctx.env.VERDANT_LIBRARY.getByName(
		getLibraryName({ planId: notebook.planId, app: 'post' }),
	);

	return ctx.body(
		serverRenderAtom({
			notebook: addNotebookUrl(notebook, customDomain, ctx),
			posts: await Promise.all(
				posts
					.map((post) => addPostUrl(post, notebookId, customDomain, ctx))
					.map((post) => processPost(post, notebook.planId, library)),
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

	const db = createDb(ctx.env.CORE_DB);
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

	const library = await ctx.env.VERDANT_LIBRARY.getByName(
		getLibraryName({ planId: notebook.planId, app: 'post' }),
	);

	const postWithUrl = await processPost(
		addPostUrl(post, notebookId, customDomain, ctx),
		notebook.planId,
		library,
	);
	const data = {
		post: postWithUrl,
		notebook: addNotebookUrl(notebook, customDomain, ctx),
	};

	const { serverRenderPost } = await import('@post.biscuits/hub');
	const appHtml = serverRenderPost(data);
	const { theme, globalStyle } = getNotebookGlobalStyle(notebook);
	return renderTemplate('post', ctx, {
		appHtml,
		data,
		theme,
		globalStyle,
		title: `${post.title} | ${notebook.name}`,
	});
});

postRouter.get('/hub/*', (ctx) =>
	staticFile('post', 'client', ctx, 'post/hub'),
);
