import { db, sql } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import { readFile } from 'fs/promises';
import { Hono } from 'hono';
import path from 'path';
import { renderTemplate, staticFile } from '../common/hubs.js';
import { DEPLOYED_ORIGIN } from '../config/deployedContext.js';
import { Env } from '../config/hono.js';

export const postRouter = new Hono<Env>();

const hubPath = path.join(process.cwd(), '..', 'apps', 'post', 'hub', 'dist');
const hubClientPath = path.join(hubPath, 'client');

postRouter.get('/hub/assets/*', ({ req }) =>
	staticFile(hubClientPath, 'post/hub', req.raw),
);
postRouter.get('/hub/favicon.ico', ({ req }) =>
	staticFile(hubClientPath, 'post/hub', req.raw),
);

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

	const data = { notebook, posts };

	const { serverRenderNotebook } = await import('@post.biscuits/hub');
	const appHtml = serverRenderNotebook(data);
	return renderTemplate(indexTemplate, appHtml, data);
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
	const url =
		customDomain ?
			`https://${customDomain}`
		:	`https://${DEPLOYED_ORIGIN}/post/hub/${notebookId}`;
	return ctx.body(
		serverRenderAtom({ notebook, posts, url, feedUrl: url + `/atom.xml` }),
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
		])
		.executeTakeFirstOrThrow(
			() =>
				new BiscuitsError(BiscuitsError.Code.NotFound, 'Notebook not found'),
		);

	const data = { post, notebook };

	const indexTemplate = await readFile(
		path.join(hubClientPath, 'src/pages/post/index.html'),
		'utf8',
	);

	const { serverRenderPost } = await import('@post.biscuits/hub');
	const appHtml = serverRenderPost(data);
	return renderTemplate(indexTemplate, appHtml, data);
});

postRouter.get('/hub/*', ({ req }) =>
	staticFile(hubClientPath, 'post/hub', req.raw),
);
