import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import { RecipeList } from '@/components/recipes/collection/RecipeList.jsx';
import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { Icon, PageContent, PageNowPlaying } from '@a-type/ui';
import { Suspense } from 'react';

export function RecipesPage() {
	usePageTitle('Recipes');

	return (
		<>
			<PageContent>
				<RecipeList />
				<Suspense>
					<PageNowPlaying style={{ pointerEvents: 'none' }}>
						<Suspense>
							<RecipeCreateButton
								style={{ pointerEvents: 'auto', width: 48, height: 48 }}
							>
								<Icon name="plus" size={20} />
							</RecipeCreateButton>
						</Suspense>
						<RecipesNowPlaying showSingle defaultOpen />
					</PageNowPlaying>
				</Suspense>
			</PageContent>
		</>
	);
}

export default RecipesPage;
