import { useRecipeFromSlugUrl } from '@/components/recipes/hooks.js';
import { useNowPlayingRecipes } from '@/components/recipes/nowPlaying/hooks.js';
import { RecipeNotFound } from '@/components/recipes/RecipeNotFound.jsx';
import { RecipeOverview as RecipeOverviewBase } from '@/components/recipes/viewer/RecipeOverview.jsx';
import { useParams } from '@verdant-web/react-router';
import { Activity, memo } from 'react';

const RecipeOverview = memo(RecipeOverviewBase);

export interface RecipeOverviewPageProps {}

export function RecipeOverviewPage({}: RecipeOverviewPageProps) {
	const { slug: activeSlugFull } = useParams();
	const { allRecipes } = useNowPlayingRecipes();
	const activeRecipe = useRecipeFromSlugUrl(activeSlugFull);

	if (!activeRecipe) return <RecipeNotFound />;

	return (
		<>
			<Activity mode="visible">
				<RecipeOverview recipe={activeRecipe} />
			</Activity>
			{allRecipes
				.filter((r) => r !== activeRecipe)
				.map((recipe) => (
					<Activity key={recipe.uid} mode="hidden">
						<RecipeOverview recipe={recipe} />
					</Activity>
				))}
		</>
	);
}

export default RecipeOverviewPage;
