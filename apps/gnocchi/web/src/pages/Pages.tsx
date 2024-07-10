import { GlobalLoader } from '@/GlobalLoader.jsx';
import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import { BugButton } from '@/components/menu/BugButton.jsx';
import { LinkButton } from '@/components/nav/Link.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { TopLoader } from '@/components/nav/TopLoader.jsx';
import { SubscriptionPromotionContent } from '@/components/promotional/SubscriptionPromotionContent.jsx';
import { RecipeTagEditor } from '@/components/recipes/tags/RecipeTagEditor.jsx';
import {
  ReloadButton,
  useHadRecentError,
} from '@/components/sync/ReloadButton.jsx';
import {
  updateApp,
  updateState,
} from '@/components/updatePrompt/updateState.js';
import { groceriesDescriptor, hooks } from '@/stores/groceries/index.js';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import { PageRoot } from '@a-type/ui/components/layouts';
import { H1, P } from '@a-type/ui/components/typography';
import {
  Essentials,
  ResetToServer,
  SubscribedOnly,
  SubscriptionPromotion,
} from '@biscuits/client';
import { Outlet, Router, makeRoutes } from '@verdant-web/react-router';
import { Suspense, useCallback } from 'react';
import { lazyWithPreload } from 'react-lazy-with-preload';
import { NotFoundPage } from './NotFoundPage.jsx';
import { GroceriesPage } from './groceries/GroceriesPage.js';

const PlanPage = lazyWithPreload(() => import('./PlanPage.jsx'));
const RecipeViewPage = lazyWithPreload(
  () => import('./recipe/RecipeViewPage.jsx'),
);
const RecipeEditPage = lazyWithPreload(
  () => import('./recipe/RecipeEditPage.jsx'),
);
const RecipeOverviewPage = lazyWithPreload(
  () => import('./recipe/RecipeOverviewPage.jsx'),
);
const PantryPage = lazyWithPreload(() => import('./pantry/PantryPage.js'));
const PantryListPage = lazyWithPreload(
  () => import('./pantry/PantryListPage.js'),
);
const PantrySearchPage = lazyWithPreload(
  () => import('./pantry/PantrySearchPage.js'),
);
const RecipesPage = lazyWithPreload(() => import('./recipe/RecipesPage.jsx'));

const routes = makeRoutes([
  {
    path: '/',
    component: LayoutWithNavBar,
    children: [
      {
        index: true,
        component: GroceriesPage,
        onVisited: () => {
          PantryPage.preload();
          PantryListPage.preload();
          PlanPage.preload();
          RecipesPage.preload();
        },
        data: {
          right: '/pantry',
        },
      },
      {
        path: 'list/:listId',
        component: GroceriesPage,
      },
      {
        path: 'settings',
        component: PlanPage,
        data: {
          left: '/recipes',
        },
      },
      {
        path: 'pantry',
        component: PantryPage,
        onVisited: () => {
          RecipesPage.preload();
          PantryListPage.preload();
          PantrySearchPage.preload();
        },
        data: {
          left: '/',
          right: '/recipes',
        },
        children: [
          {
            index: true,
            component: PantryListPage,
          },
          {
            path: 'search',
            component: PantrySearchPage,
          },
        ],
      },
      {
        path: 'recipes',
        exact: true,
        component: RecipesPage,
        onVisited: () => {
          RecipeViewPage.preload();
          RecipeOverviewPage.preload();
          PantryPage.preload();
          PantryListPage.preload();
        },
        data: {
          left: '/pantry',
          right: '/settings',
        },
      },
      {
        path: 'recipes/:slug',
        component: RecipeViewPage,
        onVisited: () => {
          RecipeEditPage.preload();
        },
        data: {
          left: '/pantry',
          right: '/settings',
        },
        children: [
          {
            path: '',
            exact: true,
            component: RecipeOverviewPage,
          },
          {
            path: 'edit',
            component: RecipeEditPage,
          },
          {
            // legacy path
            path: 'cook',
            component: RecipeOverviewPage,
          },
        ],
      },
      {
        path: '',
        component: NotFoundPage,
      },
    ],
  },
]);

function LayoutWithNavBar() {
  return (
    <PageRoot>
      <Outlet />
      <NavBar />
    </PageRoot>
  );
}

export function Pages() {
  const client = hooks.useClient();
  const handleNavigate = useCallback(
    (
      location: Location,
      ev: { state?: any; skipTransition?: boolean },
      prev: { pathname: string },
    ) => {
      // only update on path changes
      if (
        updateState.updateAvailable &&
        location.pathname !== prev.pathname &&
        !ev.state?.noUpdate
      ) {
        console.info('Update ready to install, intercepting navigation...');
        updateApp(ev?.state?.isSwipeNavigation);
        return false;
      }
      // if first-level path changes, reset undo state
      const firstLevelFrom = prev.pathname.split('/')[0];
      const firstLevelTo = location.pathname.split('/')[0];
      if (firstLevelFrom !== firstLevelTo) {
        client.undoHistory.clear();
      }
    },
    [client],
  );
  return (
    <ErrorBoundary fallback={(props) => <ErrorFallback {...props} />}>
      <Suspense fallback={<GlobalLoader />}>
        <Router routes={routes} onNavigate={handleNavigate}>
          <TopLoader />
          <Outlet />
          <Essentials />
          <RecipeTagEditor />
          <FoodDetailDialog />
          <SubscriptionPromotion>
            <SubscriptionPromotionContent />
          </SubscriptionPromotion>
        </Router>
      </Suspense>
    </ErrorBoundary>
  );
}

function ErrorFallback({ clearError }: { clearError: () => void }) {
  const hadRecentError = useHadRecentError();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-start justify-center gap-4 max-w-content">
        <H1>Something went wrong</H1>
        <P>
          Sorry about this. The app has crashed.{' '}
          {hadRecentError
            ? `Looks like refreshing didn't work either... I recommend reporting a bug using the button below.`
            : `You can try refreshing, but if
					that doesn't work, use the button below to report the issue.`}
        </P>
        <LinkButton to="/" onClick={clearError}>
          Go Home
        </LinkButton>
        <ReloadButton />
        <BugButton />
        {hadRecentError && (
          <SubscribedOnly>
            <ResetToServer clientDescriptor={groceriesDescriptor} />
          </SubscribedOnly>
        )}
      </div>
    </div>
  );
}
