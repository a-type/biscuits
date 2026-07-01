import { ShareTargetListPicker } from '@/components/shareTarget/ShareTargetListPicker.jsx';
import { ErrorBoundary, Spinner } from '@a-type/ui';
import {
	GlobalErrorFallback,
	updateApp,
	updateState,
} from '@biscuits/client/apps';
import { makeRoutes, Outlet, Router } from '@verdant-web/react-router';
import { lazy, Suspense, useCallback } from 'react';
import { HomePage } from './HomePage.jsx';
import ListPage from './ListPage.jsx';

const routes = makeRoutes([
	{
		path: '/',
		exact: true,
		component: HomePage,
	},
	{
		path: '/buy-yearly',
		component: lazy(() => import('./BuyYearlyPage.jsx')),
	},
	{
		path: '/settings',
		component: lazy(() => import('./SettingsPage.jsx')),
	},
	{
		path: '/preview-request',
		component: lazy(() => import('./PreviewRequestPage.jsx')),
	},
	{
		path: '/:listId',
		component: ListPage,
	},
]);

export function Pages() {
	const handleNavigate = useCallback(
		(
			loc: Location,
			ev: { state?: any; skipTransition?: boolean },
			prev: { pathname: string },
		) => {
			// if only the search params changed, don't update the app
			if (prev.pathname === loc.pathname) {
				return true;
			}
			if (updateState.updateAvailable) {
				console.info('Update ready to install, intercepting navigation...');
				updateApp();
				return false;
			}
		},
		[],
	);
	return (
		<ErrorBoundary fallback={(props) => <GlobalErrorFallback {...props} />}>
			<Suspense fallback={<Spinner />}>
				<Router routes={routes} onNavigate={handleNavigate}>
					<Outlet />
					<Suspense>
						<ShareTargetListPicker />
					</Suspense>
				</Router>
			</Suspense>
		</ErrorBoundary>
	);
}
