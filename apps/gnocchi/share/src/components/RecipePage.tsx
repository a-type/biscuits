import {
	Box,
	Button,
	Chip,
	Divider,
	H1,
	H2,
	Note,
	P,
	PageContent,
	PageFixedArea,
	PageRoot,
	Provider as UIProvider,
} from '@a-type/ui';
import { graphql, ResultOf } from '@biscuits/graphql';
import { useLocation } from '@tanstack/react-router';
import { Suspense, useEffect } from 'react';
import { Ingredients, ingredientsFragment } from '~/components/Ingredients.js';
import {
	Instructions,
	instructionsFragment,
} from '~/components/Instructions.js';
import { TopLineRoot, TopLineTitle } from '~/components/layout.js';
import { MainImage } from '~/components/MainImage.js';
import { Prelude } from '~/components/Prelude.js';

export const recipePageQuery = graphql(
	`
		query RecipePage($planId: ID!, $slug: String!) {
			publicRecipe(planId: $planId, slug: $slug) {
				id
				title
				note
				prepTimeMinutes
				cookTimeMinutes
				totalTimeMinutes
				servings
				mainImageUrl
				prelude
				publisher {
					fullName
				}
				...Ingredients
				...Instructions
			}
		}
	`,
	[ingredientsFragment, instructionsFragment],
);

export interface RecipePageProps {
	data: ResultOf<typeof recipePageQuery>['publicRecipe'];
}

export function RecipePage({ data }: RecipePageProps) {
	const url = useLocation().href;

	useEffect(() => {
		if (!data?.title) return;
		// set page title to recipe title on load
		document.title = data.title;
	}, [data?.title]);

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
		<UIProvider>
			<PageRoot className="theme-lemon">
				<PageContent className="max-w-600px">
					<article
						itemScope
						itemType="https://schema.org/Recipe"
						className="h-recipe flex flex-col gap-4 items-stretch"
					>
						<Box gap items="center" asChild>
							<a href="https://biscuits.club/gnocchi">
								<img
									src="/icon.png"
									className="w-30px h-30px"
									alt="Gnocchi icon"
								/>
								<H1 className="!text-lg !font-medium font-fancy">
									Gnocchi Recipes
								</H1>
							</a>
						</Box>
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
						{data.note && (
							<Note className="self-start max-w-400px">{data.note}</Note>
						)}
						{data.prelude && (
							<div>
								<Prelude content={data.prelude} />
							</div>
						)}
						<Divider />
						<div className="my-4">
							<H2 className="gutter-bottom">Ingredients</H2>
							<Ingredients data={data} />
						</div>
						<Divider />
						<div className="mb-12 mt-4">
							<H2 className="gutter-bottom">Instructions</H2>
							<Suspense>
								<Instructions data={data} />
							</Suspense>
						</div>
						<PageFixedArea className="flex flex-row justify-end bottom-4 top-auto mb-4 bg-transparent">
							<Button emphasis="primary" className="shadow-lg" asChild>
								<a
									href={`${
										import.meta.env.VITE_APP_ORIGIN
									}?recipeUrl=${encodeURIComponent(url)}&hub=true&skipWelcome=true`}
								>
									Cook with Gnocchi
								</a>
							</Button>
						</PageFixedArea>
						<P className="color-gray7 ml-auto text-right text-xs">
							Powered by{' '}
							<a
								className="font-bold color-black"
								href="https://biscuits.club/gnocchi"
							>
								Gnocchi
							</a>
							, the freshest way to manage your weekly cooking
						</P>
					</article>
				</PageContent>
			</PageRoot>
		</UIProvider>
	);
}
