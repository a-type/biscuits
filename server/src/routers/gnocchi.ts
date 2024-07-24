import { Router } from 'itty-router';
import * as path from 'path';
import * as fsSync from 'fs';
import { serverRender, type HubRecipeData } from '@gnocchi.biscuits/hub';
import { verdantServer } from '../verdant/verdant.js';
import { getLibraryName } from '@biscuits/libraries';
import { db } from '@biscuits/db';
import { renderTemplate, staticFile } from '../common/hubs.js';

export const gnocchiRouter = Router({
  base: '/gnocchi',
});

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

gnocchiRouter.get('/hubRecipe/assets/*', (req) =>
  staticFile(hubClientPath, 'hubRecipe', req),
);

gnocchiRouter.get('/hubRecipe/:planId/:recipeSlug', async (req) => {
  const { planId, recipeSlug } = req.params;

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

  const appHtml = serverRender(data, req.url);
  return renderTemplate(indexTemplate, appHtml, data);
});

gnocchiRouter.get('/hubRecipe/*', (req) =>
  staticFile(hubClientPath, 'hubRecipe', req),
);
