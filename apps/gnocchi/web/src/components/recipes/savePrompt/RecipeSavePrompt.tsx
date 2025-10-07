import { TextLink } from '@/components/nav/Link.jsx';
import { recipeSavePromptState } from '@/components/recipes/savePrompt/state.js';
import { firstTimeOnboarding } from '@/onboarding/firstTimeOnboarding.js';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	H2,
	P,
} from '@a-type/ui';
import { OnboardingBanner, useLocalStorage } from '@biscuits/client';
import { useNavigate, useSearchParams } from '@verdant-web/react-router';
import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';

export interface RecipeSavePromptProps {}

export function RecipeSavePrompt({}: RecipeSavePromptProps) {
	const { url } = useSnapshot(recipeSavePromptState);
	const navigate = useNavigate();
	const [search] = useSearchParams();
	const [hasScannedBefore, setHasScannedBefore] = useLocalStorage(
		'hasScannedBefore',
		false,
	);

	const urlParam = search.get('recipeUrl');
	useEffect(() => {
		if (urlParam) {
			recipeSavePromptState.url = urlParam;
		}
	}, [urlParam]);
	const slugParam = search.get('recipeSlug');
	useEffect(() => {
		if (slugParam) {
			recipeSavePromptState.hubSlug = slugParam;
		}
	}, [slugParam]);

	const isGnocchi =
		url.includes('gnocchi.biscuits.club') || url.includes('localhost:6124');

	const beginOnboarding = saveHubRecipeOnboarding.useBegin();
	const cancelOnboarding = saveHubRecipeOnboarding.useCancel();
	const cancelFirstTimeOnboarding = firstTimeOnboarding.useCancel();
	useEffect(() => {
		if (isGnocchi && !hasScannedBefore) {
			beginOnboarding();
			// abort first-time onboarding; superseded by this flow.
			console.debug(
				'Abort first-time onboarding in favor of recipe onboarding flow',
			);
			cancelFirstTimeOnboarding();
		}
	}, [isGnocchi, hasScannedBefore, beginOnboarding, cancelFirstTimeOnboarding]);

	const addRecipeFromUrl = hooks.useAddRecipeFromUrl();
	const [loading, setLoading] = useState(false);
	const save = async () => {
		setLoading(true);
		try {
			const recipe = await addRecipeFromUrl(url);
			setHasScannedBefore(true);
			if (recipe) {
				navigate(
					`/recipes/${recipe.get(
						'slug',
					)}?firstTimeScanFlow=true&skipWelcome=true`,
					{
						replace: true,
					},
				);
			}
			recipeSavePromptState.url = '';
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={!!url} onOpenChange={() => (recipeSavePromptState.url = '')}>
			<DialogContent>
				<DialogTitle>
					{isGnocchi ? 'Save recipe?' : 'Scan web recipe?'}
				</DialogTitle>
				<OnboardingBanner
					disableNext
					onboarding={saveHubRecipeOnboarding}
					step="save"
				>
					<H2>Welcome to Gnocchi!</H2>
					<P>
						You&apos;re about to save a copy of a recipe to your collection.
						Press the Save button to get started.
					</P>
				</OnboardingBanner>
				<P>
					Add a copy of this recipe to your collection and access it any time.
				</P>
				{!isGnocchi && (
					<P
						className="my-2"
						style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
					>
						{url}
					</P>
				)}

				<span className="text-sm">
					By continuing you agree to{' '}
					<TextLink to="/tos" newTab>
						the terms and conditions of usage.
					</TextLink>
				</span>
				<DialogActions>
					<DialogClose asChild>
						<Button onClick={cancelOnboarding}>Cancel</Button>
					</DialogClose>
					<Button color="primary" onClick={save} loading={loading}>
						{isGnocchi ? 'Save it!' : 'Scan it!'}
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
