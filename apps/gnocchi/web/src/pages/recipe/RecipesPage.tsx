import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import { RecipeList } from '@/components/recipes/collection/RecipeList.jsx';
import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { Icon, PageContent, PageNowPlaying } from '@a-type/ui';
import { RestoreScroll } from '@verdant-web/react-router';
import { Suspense } from 'react';

export function RecipesPage() {
	usePageTitle('Recipes');

	return (
		<>
			<PageContent>
				<RecipeList />
				<Suspense>
					<PageNowPlaying className="pointer-events-none z-now-playing flex flex-col items-center">
						<Suspense>
							<RecipeCreateButton className="pointer-events-auto h-48px w-48px items-center justify-center shadow-xl md:h-auto md:w-auto md:gap-2">
								<span className="hidden md:block">New Recipe</span>
								<Icon
									name="plus"
									className="h-20px w-20px md:(h-15px w-15px)"
								/>
							</RecipeCreateButton>
						</Suspense>
						<RecipesNowPlaying showSingle defaultOpen />
					</PageNowPlaying>
				</Suspense>
			</PageContent>
			<RestoreScroll />
		</>
	);
}

export default RecipesPage;
