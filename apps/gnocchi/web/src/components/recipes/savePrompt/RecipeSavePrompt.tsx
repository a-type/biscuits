import { TextLink } from '@/components/nav/Link.jsx';
import { recipeSavePromptState } from '@/components/recipes/savePrompt/state.js';
import { firstTimeOnboarding } from '@/onboarding/firstTimeOnboarding.js';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import {
	useAddRecipeFromSlug,
	useAddRecipeFromUrl,
} from '@/stores/groceries/mutations.js';
import { Button, Dialog, H2, P } from '@a-type/ui';
import { OnboardingBanner, useLocalStorage } from '@biscuits/client';
import { useNavigate, useSearchParams } from '@verdant-web/react-router';
import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';

export interface RecipeSavePromptProps {}

export function RecipeSavePrompt({}: RecipeSavePromptProps) {
	const { url: externalUrl } = useSnapshot(recipeSavePromptState);
	const navigate = useNavigate();
	const [search] = useSearchParams();
	const [hasScannedBefore, setHasScannedBefore] = useLocalStorage(
		'hasScannedBefore',
		false,
	);

	const urlParam = search.get('recipeUrl');
	const slugParam = search.get('recipeSlug');

	const url = externalUrl || urlParam || '';

	const titleParam = search.get('recipeTitle');

	const isGnocchi = !!slugParam;

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

	const addRecipeFromUrl = useAddRecipeFromUrl();
	const addRecipeFromSlug = useAddRecipeFromSlug();
	const [loading, setLoading] = useState(false);
	const save = async () => {
		setLoading(true);
		try {
			const recipe = slugParam
				? await addRecipeFromSlug(slugParam)
				: await addRecipeFromUrl(url);
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

	const open = !!url || !!slugParam;

	return (
		<Dialog open={open} onOpenChange={() => (recipeSavePromptState.url = '')}>
			<Dialog.Content className="flex flex-col gap-sm">
				<Dialog.Title>
					{isGnocchi ? 'Save recipe?' : 'Scan web recipe?'}
				</Dialog.Title>
				{open && (
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
				)}
				<P>
					Add a copy of this recipe to your collection and access it any time.
				</P>
				{(titleParam || url) && (
					<P
						className="my-2"
						style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
					>
						{titleParam || url}
					</P>
				)}

				<span className="text-sm">
					By continuing you agree to{' '}
					<TextLink to="/tos" newTab>
						the terms and conditions of usage.
					</TextLink>
				</span>
				<Dialog.Actions>
					<Dialog.Close render={<Button onClick={cancelOnboarding} />}>
						Cancel
					</Dialog.Close>
					<Button emphasis="primary" onClick={save} loading={loading}>
						{isGnocchi ? 'Save it!' : 'Scan it!'}
					</Button>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
