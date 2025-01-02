import { Icon } from '@/components/icons/Icon.jsx';
import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import { RecipeList } from '@/components/recipes/collection/RecipeList.jsx';
import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { PageContent, PageNowPlaying } from '@a-type/ui';
import { Suspense } from 'react';

export interface RecipesPageProps {}

export function RecipesPage({}: RecipesPageProps) {
	usePageTitle('Recipes');
	return (
		<PageContent>
			<Suspense>
				<RecipeList />
			</Suspense>
			<Suspense>
				<PageNowPlaying
					unstyled
					className="flex flex-col items-center pointer-events-none"
				>
					<Suspense>
						<RecipeCreateButton className="pointer-events-auto w-48px h-48px items-center justify-center md:w-auto md:h-auto md:gap-2 shadow-xl">
							<span className="hidden md:block">New Recipe</span>
							<Icon name="plus" className="w-20px h-20px md:(w-15px h-15px)" />
						</RecipeCreateButton>
					</Suspense>
					<RecipesNowPlaying showSingle defaultOpen />
				</PageNowPlaying>
			</Suspense>
			<AutoRestoreScroll />
		</PageContent>
	);
}

export default RecipesPage;
