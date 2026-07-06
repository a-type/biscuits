import { GlobalLoader } from '@/GlobalLoader.jsx';
import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { SubscriptionPromotionContent } from '@/components/promotional/SubscriptionPromotionContent.jsx';
import { RecipeTagEditor } from '@/components/recipes/tags/RecipeTagEditor.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { ErrorBoundary, PageRoot } from '@a-type/ui';
import { SubscriptionPromotion } from '@biscuits/client';
import {
	Essentials,
	GlobalErrorFallback,
	updateApp,
	updateState,
} from '@biscuits/client/apps';
import { makeRoutes, Outlet, Router } from '@verdant-web/react-router';
import { Suspense, useCallback } from 'react';
import { lazyWithPreload } from 'react-lazy-with-preload';
import { NotFoundPage } from './NotFoundPage.jsx';
import { GroceriesPage } from './groceries/GroceriesPage.js';
import RecipesWrapper from './recipe/RecipesWrapper.jsx';

const SettingsPage = lazyWithPreload(() => import('./SettingsPage.jsx'));
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
const PublishedRecipesPage = lazyWithPreload(
	() => import('./recipe/PublishedRecipesPage.jsx'),
);

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
					SettingsPage.preload();
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
				component: SettingsPage,
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
				component: RecipesWrapper,
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
				children: [
					{
						path: 'published',
						component: PublishedRecipesPage,
					},
					{
						path: ':slug',
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
								index: true,
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
						index: true,
						component: RecipesPage,
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
			prev?: { pathname: string },
		) => {
			// only update on path changes
			if (
				updateState.updateAvailable &&
				location.pathname !== prev?.pathname &&
				!ev.state?.noUpdate
			) {
				console.info('Update ready to install, intercepting navigation...');
				updateApp(ev?.state?.isSwipeNavigation);
				return false;
			}
			if (!prev) {
				return;
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
		<ErrorBoundary fallback={(props) => <GlobalErrorFallback {...props} />}>
			<Suspense fallback={<GlobalLoader />}>
				<Router routes={routes} onNavigate={handleNavigate}>
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
