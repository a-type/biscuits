import React, { Suspense } from 'react';
import {
  IngredientList,
  IngredientListItem,
} from './components/IngredientList.jsx';
import { Instructions } from './components/Instructions.jsx';
import { MainImage } from './components/MainImage.jsx';
import { Prelude } from './components/Prelude.jsx';
import { TopLineRoot, TopLineTitle } from './components/layout.jsx';
import { Button } from '@a-type/ui/components/button';
import { Divider } from '@a-type/ui/components/divider';
import {
  PageContent,
  PageFixedArea,
  PageRoot,
} from '@a-type/ui/components/layouts';
import { Note } from '@a-type/ui/components/note';
import { H1, H2, P } from '@a-type/ui/components/typography';
import { HubRecipeData } from './types.js';
import { Chip } from '@a-type/ui/components/chip';

export function App({
  recipe: data,
  url,
}: {
  recipe: HubRecipeData;
  url: string;
}) {
  if (!data) {
    return (
      <PageRoot className="theme-lemon">
        <PageContent>
          <H1>Not found</H1>
        </PageContent>
      </PageRoot>
    );
  }

  return (
    <PageRoot className="theme-lemon">
      <PageContent>
        <article
          itemScope
          itemType="https://schema.org/Recipe"
          className="h-recipe flex flex-col gap-4 items-stretch"
        >
          <TopLineRoot>
            {data.mainImageUrl && (
              <MainImage url={data.mainImageUrl} title={data.title} />
            )}
            <TopLineTitle>
              <H1 itemProp="name" className="p-name">
                {data.title}
              </H1>
              <P itemProp="author" className="p-author">
                Published by {data.publisher?.fullName ?? 'Anonymous'}
              </P>
              <div className="row flex-wrap">
                {data.servings && <Chip>Serves {data.servings}</Chip>}
                {data.prepTimeMinutes && (
                  <>
                    <Chip>Prep {data.prepTimeMinutes} min</Chip>
                    <span className="hidden" itemProp="prepTime">
                      P0Y0M0DT0H{data.prepTimeMinutes}M0S
                    </span>
                  </>
                )}
                {data.cookTimeMinutes && (
                  <>
                    <Chip>Cook {data.cookTimeMinutes} min</Chip>
                    <span className="hidden" itemProp="cookTime">
                      P0Y0M0DT0H{data.cookTimeMinutes}M0S
                    </span>
                  </>
                )}
                {data.totalTimeMinutes && (
                  <>
                    <Chip>Total {data.totalTimeMinutes} min</Chip>
                    <span className="hidden" itemProp="totalTime">
                      P0Y0M0DT0H{data.totalTimeMinutes}M0S
                    </span>
                  </>
                )}
              </div>
            </TopLineTitle>
          </TopLineRoot>
          {data.note && <Note className="self-start">{data.note}</Note>}
          {data.prelude && (
            <div>
              <Suspense>
                <Prelude content={data.prelude} />
              </Suspense>
            </div>
          )}
          <Divider />
          <div className="my-4">
            <H2 className="gutter-bottom">Ingredients</H2>
            <IngredientList>
              {data.ingredients.map((ingredient: any) => (
                <IngredientListItem key={ingredient.id}>
                  <div itemProp="recipeIngredient" className="p-ingredient">
                    {ingredient.text}
                  </div>
                  {ingredient.note && (
                    <Note className="ml-4">{ingredient.note}</Note>
                  )}
                </IngredientListItem>
              ))}
            </IngredientList>
          </div>
          <Divider />
          <div className="mb-12 mt-4">
            <H2 className="gutter-bottom">Instructions</H2>
            <Suspense>
              <Instructions instructions={data.instructions} />
            </Suspense>
          </div>
          <PageFixedArea className="flex flex-row justify-end bottom-4 top-auto mb-4 bg-transparent">
            <a
              href={`${
                import.meta.env.VITE_APP_GNOCCHI_ORIGIN
              }?recipeUrl=${encodeURIComponent(url)}&hub=true&skipWelcome=true`}
            >
              <Button color="primary" className="shadow-lg">
                Save Recipe
              </Button>
            </a>
          </PageFixedArea>
          <P className="color-gray7 ml-auto text-right text-sm">
            Powered by{' '}
            <a
              className="font-bold color-black"
              href="https://gnocchi.biscuits.club/welcome"
            >
              Gnocchi
            </a>
            , the freshest way to manage your weekly cooking
          </P>
        </article>
      </PageContent>
    </PageRoot>
  );
}
