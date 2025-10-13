import { AddImagePrompt } from '@/components/recipes/cook/AddImagePrompt.jsx';
import { AddNotePrompt } from '@/components/recipes/cook/AddNotePrompt.jsx';
import { CookingToolbar } from '@/components/recipes/cook/CookingToolbar.jsx';
import { InstructionsProvider } from '@/components/recipes/editor/InstructionStepNodeView.jsx';
import { HeaderBar } from '@/components/recipes/layout/HeaderBar.jsx';
import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import { CookingActionBar } from '@/components/recipes/viewer/actions/CookingActionBar.jsx';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { viewerState } from '@/components/recipes/viewer/state.js';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { useWakeLock } from '@/hooks/useWakeLock.js';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Button,
	Chip,
	Divider,
	H1,
	H2,
	Heading,
	Icon,
	P,
	PageNowPlaying,
	Text,
} from '@a-type/ui';
import { formatMinutes } from '@a-type/utils';
import { OnboardingBanner } from '@biscuits/client';
import { Recipe } from '@gnocchi.biscuits/verdant';
import classNames from 'classnames';
import { format } from 'date-fns';
import { Suspense, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { RecipeTagsEditor } from '../editor/RecipeTagsEditor.jsx';
import { useActiveCookingSession, useWatchChanges } from '../hooks.js';
import {
	ImageContainer,
	TitleAndImageLayout,
	TitleContainer,
} from '../layout/TitleAndImageLayout.jsx';
import { AddToListButton } from './AddToListButton.jsx';
import { RecipeCopiesTag } from './RecipeCopiesTag.jsx';
import { RecipeCopyOriginalLink } from './RecipeCopyOriginalLink.jsx';
import { RecipeIngredientsViewer } from './RecipeIngredientsViewer.jsx';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { RecipeMainImageViewer } from './RecipeMainImageViewer.jsx';
import { RecipeMultiplierField } from './RecipeMultiplierField.jsx';
import { RecipePreludeViewer } from './RecipePreludeViewer.jsx';

export interface RecipeOverviewProps {
	recipe: Recipe;
}

export function RecipeOverview({ recipe }: RecipeOverviewProps) {
	const {
		title,
		createdAt,
		url,
		mainImage,
		cookTimeMinutes,
		prepTimeMinutes,
		totalTimeMinutes,
		servings,
		multiplier,
		copyOf,
	} = hooks.useWatch(recipe);
	useWatchChanges(recipe);

	useViewingRecipePresence(recipe);

	const multipliedServings = Math.round((servings ?? 0) * multiplier);

	usePageTitle(title.slice(0, 20));

	const stepsRef = useShowToolsWhenStepsVisible();

	useWakeLock();

	return (
		<>
			<div id="pageTop" />
			<HeaderBar backUrl="/recipes">
				<CookingActionBar recipe={recipe} style={{ flex: 1, minWidth: 0 }} />
			</HeaderBar>
			<OnboardingBanner onboarding={saveHubRecipeOnboarding} step="recipe">
				<H2>This is your copy!</H2>
				<P>Feel free to make changes, add notes, etc.</P>
			</OnboardingBanner>
			<Box
				full="width"
				col
				items="start"
				gap="lg"
				p="sm"
				style={{ paddingBottom: '33dvh' }}
			>
				<TitleAndImageLayout>
					<TitleContainer>
						<Box
							full="width"
							col
							items="start"
							gap="md"
							style={{ marginBlock: 12, alignSelf: 'start' }}
						>
							<H1>{title}</H1>
							<Box items="start" gap="sm">
								<RecipeNote recipe={recipe} />
							</Box>

							<Box full="width" col items="start" gap="sm">
								<Box wrap items="center" gap="sm" className="@mode-neutral">
									<Chip
										onClick={() => {
											document
												.getElementById('#steps')
												?.scrollIntoView({ behavior: 'smooth' });
										}}
										emphasis="ambient"
										render={<Button size="small" />}
									>
										<Icon name="arrowDown" />
										<span>Jump to steps</span>
									</Chip>
									<Chip>Created on {format(createdAt, 'LLL do, yyyy')}</Chip>
									{!!totalTimeMinutes && (
										<Chip>Total time: {formatMinutes(totalTimeMinutes)}</Chip>
									)}
									{!!prepTimeMinutes && (
										<Chip>Prep time: {formatMinutes(prepTimeMinutes)}</Chip>
									)}
									{!!cookTimeMinutes && (
										<Chip>Cook time: {formatMinutes(cookTimeMinutes)}</Chip>
									)}
									{!!servings && (
										<Chip>
											Serves{' '}
											<Text
												color={multiplier !== 1 ? 'main' : undefined}
												bold
												className={classNames({
													'@mode-accent': multiplier !== 1,
												})}
											>
												{multipliedServings.toLocaleString()}
											</Text>
										</Chip>
									)}
									{url && (
										<Chip
											color="accent"
											render={<a href={url} target="_blank" rel="noreferrer" />}
										>
											View original{' '}
											<Icon
												name="new_window"
												style={{
													position: 'relative',
													marginLeft: 2,
													bottom: -1,
												}}
											/>
										</Chip>
									)}
									{copyOf && (
										<Chip render={<RecipeCopyOriginalLink recipe={recipe} />} />
									)}
									<RecipeCopiesTag recipe={recipe} />
									<Suspense>
										<RecipeTagsEditor
											recipe={recipe}
											className="@mode-primary"
										/>
									</Suspense>
								</Box>
							</Box>
						</Box>
					</TitleContainer>
					{mainImage && (
						<ImageContainer>
							<RecipeMainImageViewer recipe={recipe} />
						</ImageContainer>
					)}
				</TitleAndImageLayout>
				<Suspense>
					<PreludeSection recipe={recipe} />
				</Suspense>

				<Divider />
				<Box col gap full="width">
					<Box
						full="width"
						items="center"
						justify="between"
						gap="lg"
						style={{ alignSelf: 'start' }}
					>
						<Heading render={<h2 />} bold>
							Ingredients
						</Heading>
						<RecipeMultiplierField recipe={recipe} />
					</Box>
					<Box full="width" items="center" justify="between" gap="sm">
						<AddToListButton size="small" emphasis="primary" recipe={recipe}>
							<Icon name="add_to_list" />
							<span>Bulk add...</span>
						</AddToListButton>
					</Box>
					<Suspense>
						<RecipeIngredientsViewer recipe={recipe} />
					</Suspense>
				</Box>
				<Divider />
				<Box col full="width" gap="md" ref={stepsRef}>
					<Heading render={<h2 />} bold id="#steps">
						Steps
					</Heading>
					<Suspense>
						<InstructionsProvider isEditing={false} recipeId={recipe.get('id')}>
							<RecipeInstructionsViewer recipe={recipe} />
						</InstructionsProvider>
					</Suspense>
				</Box>
				<PostCooking recipe={recipe} />
				<OverviewNowPlaying recipe={recipe} />
			</Box>
		</>
	);
}

function PreludeSection({ recipe }: { recipe: Recipe }) {
	const { prelude } = hooks.useWatch(recipe);
	hooks.useWatch(prelude);

	const empty =
		!prelude ||
		!prelude.get('content') ||
		prelude
			.get('content')
			?.getSnapshot()
			?.every((p: any) => !p.content);

	if (empty) {
		return null;
	}

	return (
		<Box full="width" col gap="sm">
			<H2>Description</H2>
			<RecipePreludeViewer recipe={recipe} />
		</Box>
	);
}

function OverviewNowPlaying({ recipe }: { recipe: Recipe }) {
	const { showCookTools } = useSnapshot(viewerState);
	const { slug } = hooks.useWatch(recipe);
	return (
		<PageNowPlaying>
			<Box full="width" items="center" justify="end" gap="sm">
				{showCookTools && <CookingToolbar recipe={recipe} />}
			</Box>
			<Suspense>
				<RecipesNowPlaying showSingle={false} slug={slug} />
			</Suspense>
		</PageNowPlaying>
	);
}

function useShowToolsWhenStepsVisible() {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			const entry = entries[0];
			if (entry.isIntersecting) {
				viewerState.showCookTools = true;
			} else {
				viewerState.showCookTools = false;
			}
		});
		observer.observe(el);
		return () => {
			observer.disconnect();
		};
	}, []);
	return ref;
}

function useViewingRecipePresence(recipe: Recipe) {
	const recipeId = recipe?.get('id') ?? null;
	const client = hooks.useClient();
	useEffect(() => {
		client.sync.presence.update({ viewingRecipeId: recipeId });
	}, [recipeId, client]);
	useEffect(() => {
		return () => {
			client.sync.presence.update({ viewingRecipeId: null });
		};
	}, [client]);
}

function PostCooking({ recipe }: { recipe: Recipe }) {
	const activeSession = useActiveCookingSession(recipe);
	if (!activeSession) return null;

	return (
		<Suspense>
			<Box col full="width" gap="sm" style={{ marginBottom: 400 }}>
				<AddImagePrompt recipe={recipe} />
				<AddNotePrompt recipe={recipe} />
			</Box>
		</Suspense>
	);
}
