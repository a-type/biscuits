import { db } from '@biscuits/db';
import { getLibraryName } from '@biscuits/libraries';
import { type HubRecipeData } from '@gnocchi.biscuits/hub';
import * as fsSync from 'fs';
import { Hono } from 'hono';
import * as path from 'path';
import { renderTemplate, staticFile } from '../common/hubs.js';
import { verdantServer } from '../verdant/verdant.js';

export const gnocchiRouter = new Hono();

const hubPath = path.join(
	process.cwd(),
	'..',
	'apps',
	'gnocchi',
	'hub',
	'dist',
);
const hubClientPath = path.join(hubPath, 'client');

const indexTemplate = fsSync.readFileSync(
	path.join(hubClientPath, 'index.html'),
	'utf8',
);

gnocchiRouter.get('/hubRecipe/assets/*', (ctx) =>
	staticFile(hubClientPath, 'gnocchi/hubRecipe', ctx.req.raw),
);

gnocchiRouter.get('/hubRecipe/:planId/:recipeSlug', async (ctx) => {
	const planId = ctx.req.param('planId');
	const recipeSlug = ctx.req.param('recipeSlug');

	const recipe = await db
		.selectFrom('PublishedRecipe')
		.leftJoin('User', 'PublishedRecipe.publishedBy', 'User.id')
		.select([
			'PublishedRecipe.id',
			'User.fullName as publisherFullName',
			'PublishedRecipe.publishedBy',
		])
		.where('slug', '=', recipeSlug)
		.where('PublishedRecipe.planId', '=', planId)
		.executeTakeFirst();

	if (!recipe) {
		return new Response('Recipe not found', { status: 404 });
	}

	const snapshot = await verdantServer.getDocumentSnapshot(
		getLibraryName({
			planId,
			app: 'gnocchi',
			access: 'members',
			userId: recipe.publishedBy,
		}),
		'recipes',
		recipe.id,
	);

	if (!snapshot) {
		return new Response('Recipe not found', { status: 404 });
	}

	const data: HubRecipeData = {
		id: recipe.id,
		title: snapshot.title,
		prelude: snapshot.prelude,
		mainImageUrl: snapshot.mainImage?.url,
		ingredients: snapshot.ingredients,
		instructions: snapshot.instructions,
		note: snapshot.note,
		prepTimeMinutes: snapshot.prepTimeMinutes,
		cookTimeMinutes: snapshot.cookTimeMinutes,
		totalTimeMinutes: snapshot.totalTimeMinutes,
		servings: snapshot.servings,
		publisher: {
			fullName: recipe.publisherFullName ?? 'Anonymous',
		},
	};

	const { serverRender } = await import('@gnocchi.biscuits/hub');

	const appHtml = serverRender(data, ctx.req.url);
	return renderTemplate(indexTemplate, appHtml, data);
});

gnocchiRouter.get('/hubRecipe/*', (ctx) =>
	staticFile(hubClientPath, 'gnocchi/hubRecipe', ctx.req.raw),
);
