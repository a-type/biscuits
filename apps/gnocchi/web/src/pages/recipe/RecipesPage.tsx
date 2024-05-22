import {
  PageContent,
  PageNowPlaying,
  PageRoot,
} from '@a-type/ui/components/layouts';
import { RecipeList } from '@/components/recipes/collection/RecipeList.jsx';
import { Suspense } from 'react';
import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { Icon } from '@/components/icons/Icon.jsx';

export interface RecipesPageProps {}

export function RecipesPage({}: RecipesPageProps) {
  usePageTitle('Recipes');
  return (
    <PageContent className="rounded-b-lg border-b border-b-solid border-b-[#00000070] bg-wash sm:border-none sm:rounded-0">
      <Suspense>
        <RecipeList />
      </Suspense>
      <Suspense>
        <PageNowPlaying
          unstyled
          className="flex flex-col items-center pointer-events-none"
        >
          <Suspense>
            <RecipeCreateButton className="pointer-events-auto w-48px h-48px items-center justify-center md:w-auto md:h-auto shadow-xl">
              <span className="hidden md:block">New Recipe</span>
              <Icon name="plus" className="w-20px h-20px" />
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
