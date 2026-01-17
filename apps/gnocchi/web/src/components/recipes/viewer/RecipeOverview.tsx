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
	Button,
	Chip,
	Divider,
	H1,
	H2,
	Icon,
	P,
	PageNowPlaying,
} from '@a-type/ui';
import { formatMinutes } from '@a-type/utils';
import { OnboardingBanner } from '@biscuits/client';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
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
			<div id="pageTop" className="h-0 w-0" />
			<HeaderBar backUrl="/recipes">
				<CookingActionBar recipe={recipe} className="flex-1" />
			</HeaderBar>
			<OnboardingBanner onboarding={saveHubRecipeOnboarding} step="recipe">
				<H2>This is your copy!</H2>
				<P>Feel free to make changes, add notes, etc.</P>
			</OnboardingBanner>
			<div className="w-full flex flex-col items-start gap-6 pb-33dvh">
				<TitleAndImageLayout>
					<TitleContainer>
						<div className="my-3 w-full flex flex-col items-start self-start gap-4 text-xs">
							<H1>{title}</H1>
							<div className="flex flex-row items-start gap-2">
								<RecipeNote recipe={recipe} />
							</div>

							<div className="w-full flex flex-col items-start justify-between gap-3">
								<div className="palette-gray flex flex-row flex-wrap gap-1">
									<Chip
										className="cursor-pointer"
										onClick={() => {
											document
												.getElementById('#steps')
												?.scrollIntoView({ behavior: 'smooth' });
										}}
										render={
											<Button
												emphasis="ghost"
												className="text-xs font-normal"
											/>
										}
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
											<span
												className={classNames({
													'font-bold color-accent-dark': multiplier !== 1,
												})}
											>
												{multipliedServings.toLocaleString()}
											</span>
										</Chip>
									)}
									{url && (
										<Chip color="accent" render={<Link to={url} newTab />}>
											View original{' '}
											<Icon name="new_window" className="relative ml-2 b--1" />
										</Chip>
									)}
									{copyOf && (
										<Chip render={<RecipeCopyOriginalLink recipe={recipe} />} />
									)}
									<RecipeCopiesTag recipe={recipe} />
									<Suspense>
										<RecipeTagsEditor
											recipe={recipe}
											className="palette-primary"
										/>
									</Suspense>
								</div>
							</div>
						</div>
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
				<div className="w-full flex flex-col gap-4">
					<div className="w-auto w-full flex flex-row items-center self-start justify-between gap-6">
						<H2>Ingredients</H2>
						<RecipeMultiplierField recipe={recipe} />
					</div>
					<div className="w-full flex flex-row items-center justify-between gap-2">
						<AddToListButton size="small" emphasis="primary" recipe={recipe}>
							<Icon name="add_to_list" />
							<span>Bulk add...</span>
						</AddToListButton>
					</div>
					<Suspense>
						<RecipeIngredientsViewer recipe={recipe} />
					</Suspense>
				</div>
				<Divider />
				<div className="w-full flex flex-col gap-4" ref={stepsRef}>
					<H2 id="#steps">Steps</H2>
					<Suspense>
						<InstructionsProvider isEditing={false} recipeId={recipe.get('id')}>
							<RecipeInstructionsViewer recipe={recipe} />
						</InstructionsProvider>
					</Suspense>
				</div>
				<PostCooking recipe={recipe} />
				<OverviewNowPlaying recipe={recipe} />
			</div>
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
		<div className="w-full">
			<H2 className="gutter-bottom">Description</H2>
			<RecipePreludeViewer recipe={recipe} />
		</div>
	);
}

function OverviewNowPlaying({ recipe }: { recipe: Recipe }) {
	const { showCookTools } = useSnapshot(viewerState);
	return (
		<PageNowPlaying unstyled>
			<div className="w-full flex flex-row items-center justify-end gap-2">
				{showCookTools && (
					<CookingToolbar
						recipe={recipe}
						className="animate-springy animate-pop-up animate-duration-200"
					/>
				)}
			</div>
			<Suspense>
				<RecipesNowPlaying showSingle={false} />
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
			<div className="mt-10 w-full flex flex-col items-stretch gap-3">
				<AddImagePrompt recipe={recipe} />
				<AddNotePrompt recipe={recipe} />
			</div>
		</Suspense>
	);
}
