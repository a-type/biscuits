import { ErrorBoundary, Spinner } from '@a-type/ui';
import {
	GlobalErrorFallback,
	updateApp,
	updateState,
} from '@biscuits/client/apps';
import { makeRoutes, Outlet, Router } from '@verdant-web/react-router';
import { lazy, Suspense, useCallback } from 'react';
import { HomePage } from './HomePage.jsx';

const routes = makeRoutes([
	{
		path: '/',
		index: true,
		component: HomePage,
	},
	{
		path: '/projects/:id',
		component: lazy(() => import('./ProjectPage.jsx')),
	},
	{
		path: '/settings',
		component: lazy(() => import('./SettingsPage.jsx')),
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
				</Router>
			</Suspense>
		</ErrorBoundary>
	);
}
