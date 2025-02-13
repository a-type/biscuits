import { db } from '@biscuits/db';
import { getLibraryName } from '@biscuits/libraries';
import { type HubRecipeData } from '@gnocchi.biscuits/hub';
import * as fsSync from 'fs';
import { Hono } from 'hono';
import * as path from 'path';
import { renderTemplate, staticFile } from '../common/hubs.js';
import { Env } from '../config/hono.js';
import { verdantServer } from '../verdant/verdant.js';

export const gnocchiRouter = new Hono<Env>();

const hubPath = path.join(
	process.cwd(),
	'..',
	'apps',
	'gnocchi',
	'hub',
	'dist',
);
const hubClientPath = path.join(hubPath, 'client');

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

	const data = await loadRecipeData(
		planId,
		{
			id: recipe.publishedBy,
			fullName: recipe.publisherFullName ?? 'Anonymous',
		},
		recipe.id,
	);

	if (!data) {
		return new Response('Recipe not found', { status: 404 });
	}

	const { serverRender } = await import('@gnocchi.biscuits/hub');
	const indexTemplate = fsSync.readFileSync(
		path.join(hubClientPath, 'index.html'),
		'utf8',
	);

	const appHtml = serverRender(data, ctx.req.url);
	return renderTemplate(indexTemplate, appHtml, data);
});

gnocchiRouter.get('/hubRecipe/*', (ctx) =>
	staticFile(hubClientPath, 'gnocchi/hubRecipe', ctx.req.raw),
);

function getEmbeddedRecipeIds(snapshot: any) {
	const steps = snapshot?.instructions?.content ?? [];
	const recipeIds = new Set<string>();
	for (const step of steps) {
		if (step?.attrs?.subRecipeId) {
			recipeIds.add(step.attrs.subRecipeId);
		}
	}
	return Array.from(recipeIds);
}

async function loadRecipeData(
	planId: string,
	publisher: { id: string; fullName: string },
	recipeId: string,
): Promise<HubRecipeData | null> {
	const snapshot = await verdantServer.getDocumentSnapshot(
		getLibraryName({
			planId,
			app: 'gnocchi',
			access: 'members',
			userId: publisher.id,
		}),
		'recipes',
		recipeId,
	);

	if (!snapshot) {
		return null;
	}

	const embeddedRecipes = getEmbeddedRecipeIds(snapshot);

	const embeddedRecipeData = await Promise.all(
		embeddedRecipes.map((recipeId) =>
			loadRecipeData(planId, publisher, recipeId),
		),
	);
	const embeddedRecipeMap = embeddedRecipes.reduce(
		(map, recipeId, index) => {
			const data = embeddedRecipeData[index];
			if (data) {
				map[recipeId] = data;
			}
			return map;
		},
		{} as Record<string, HubRecipeData>,
	);

	const data: HubRecipeData = {
		id: recipeId,
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
		publisher,
		embeddedRecipes: embeddedRecipeMap,
	};

	return data;
}
