import { Router } from 'itty-router';
import * as path from 'path';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import { serverRender, type HubRecipeData } from '@gnocchi.biscuits/hub';
import { verdantServer } from '../verdant/verdant.js';
import { getLibraryName } from '@biscuits/libraries';
import { db } from '@biscuits/db';

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

const assetFileTypes: Record<string, string> = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function staticFile(req: Request) {
  const url = new URL(req.url);
  const filePath = path.join(
    hubClientPath,
    url.pathname.replace('/gnocchi/hubRecipe/', '/'),
  );

  if (!fsSync.existsSync(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const file = await fs.readFile(filePath, 'utf-8');
  return new Response(file, {
    headers: {
      'Content-Type': assetFileTypes[path.extname(filePath)] ?? 'text/plain',
    },
  });
}

gnocchiRouter.get('/hubRecipe/assets/*', staticFile);

gnocchiRouter.get('/hubRecipe/:planId/:recipeSlug', async (req) => {
  const { planId, recipeSlug } = req.params;

  const recipe = await db
    .selectFrom('PublishedRecipe')
    .leftJoin('User', 'PublishedRecipe.publishedBy', 'User.id')
    .select(['PublishedRecipe.id', 'User.fullName as publisherFullName'])
    .where('slug', '=', recipeSlug)
    .where('PublishedRecipe.planId', '=', planId)
    .executeTakeFirst();

  if (!recipe) {
    return new Response('Recipe not found', { status: 404 });
  }

  const snapshot = await verdantServer.getDocumentSnapshot(
    getLibraryName({ planId, app: 'gnocchi', access: 'members', userId: '' }),
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
  const html = indexTemplate
    .replace('<!--app-html-->', appHtml)
    .replace(`{/*snapshot*/}`, JSON.stringify(data));
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
});

gnocchiRouter.get('/hubRecipe/*', staticFile);
