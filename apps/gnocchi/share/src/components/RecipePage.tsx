import {
	Box,
	Button,
	Chip,
	Divider,
	H1,
	H2,
	Icon,
	Note,
	P,
	PageContent,
	PageFixedArea,
	PageRoot,
} from '@a-type/ui';
import { graphql, ResultOf } from '@biscuits/graphql';
import { Link } from '@tanstack/react-router';
import { Suspense, useEffect } from 'react';
import { Ingredients, ingredientsFragment } from '~/components/Ingredients.js';
import {
	Instructions,
	instructionsFragment,
	MachineReadableInstructions,
} from '~/components/Instructions.js';
import { TopLineRoot, TopLineTitle } from '~/components/layout.js';
import { MainImage } from '~/components/MainImage.js';
import { Prelude } from '~/components/Prelude.js';

export const recipePageQuery = graphql(
	`
		query RecipePage($planId: ID!, $slug: String!) {
			publicRecipe(planId: $planId, slug: $slug) {
				id
				url
				slug
				data {
					title
					note
					prepTimeMinutes
					cookTimeMinutes
					totalTimeMinutes
					servings
					mainImageUrl
					prelude
					...Ingredients
					...Instructions
				}
				author {
					name
				}
				publication {
					id
					url
					publicationName
				}
			}
		}
	`,
	[ingredientsFragment, instructionsFragment],
);

export interface RecipePageProps {
	data: ResultOf<typeof recipePageQuery>['publicRecipe'];
}

export function RecipePage({ data: response }: RecipePageProps) {
	const { data = null, author = null, publication, url, slug } = response ?? {};

	useEffect(() => {
		if (!data?.title) return;
		if (typeof document === 'undefined') return;
		// set page title to recipe title on load
		document.title = data.title;
	}, [data?.title]);

	useEffect(() => {
		// set canonical link to recipe url
		if (!url) return;
		if (typeof document === 'undefined') return;
		let link: HTMLLinkElement | null = document.querySelector(
			"link[rel='canonical']",
		);
		if (!link) {
			link = document.createElement('link');
			link.setAttribute('rel', 'canonical');
			document.head.appendChild(link);
		}
		link.setAttribute('href', url);
		return () => {
			if (link && link.parentNode) {
				link.parentNode.removeChild(link);
			}
		};
	}, [url]);

	if (!data) {
		return (
			<PageRoot className="theme-lemon">
				<PageContent>
					<H1>Not found</H1>
					{!!publication && (
						<Link to="..">
							Back to {publication?.publicationName ?? 'recipe list'}
						</Link>
					)}
				</PageContent>
			</PageRoot>
		);
	}

	return (
		<PageRoot className="theme-lemon">
			<PageContent className="max-w-600px">
				<article
					itemScope
					itemType="https://schema.org/Recipe"
					className="h-recipe flex flex-col gap-4 items-stretch"
				>
					{publication ?
						<Box gap items="center" render={<Link to={publication.url} />}>
							<Icon name="arrowLeft" /> Back to{' '}
							<b>{publication.publicationName ?? 'recipe list'}</b>
						</Box>
					:	<GnocchiHeader />}
					<TopLineRoot>
						{data.mainImageUrl && (
							<MainImage url={data.mainImageUrl} title={data.title} />
						)}
						<TopLineTitle>
							<H1 itemProp="name" className="p-name">
								{data.title}
							</H1>
							<P itemProp="author" className="p-author">
								By{' '}
								<span itemProp="author" className="p-author">
									{author?.name ?? 'Anonymous'}
								</span>
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
						<H2 className="mb-md">Ingredients</H2>
						<Ingredients data={data} />
					</div>
					<Divider />
					<div className="mb-12 mt-4">
						<H2 className="mb-md">Instructions</H2>
						<MachineReadableInstructions data={data} />
						<Suspense>
							<Instructions data={data} />
						</Suspense>
					</div>
					<PageFixedArea className="flex flex-row justify-end bottom-4 top-auto mb-4 bg-transparent">
						<Button
							emphasis="primary"
							className="shadow-lg"
							render={
								<a
									href={`${
										import.meta.env.VITE_APP_ORIGIN
									}?recipeSlug=${slug}&hub=true&skipWelcome=true&recipeTitle=${data.title}`}
								/>
							}
						>
							Cook with Gnocchi
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
	);
}

function GnocchiHeader() {
	return (
		<Box gap items="center" render={<a href="https://biscuits.club/gnocchi" />}>
			<img src="/icon.png" className="w-30px h-30px" alt="Gnocchi icon" />
			<H1 className="!text-lg !font-medium font-fancy">Gnocchi Recipes</H1>
		</Box>
	);
}
