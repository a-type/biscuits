import { Spinner } from '@a-type/ui';
import { DefaultErrorBoundary } from '@biscuits/client';
import { updateApp, updateState } from '@biscuits/client/apps';
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
		path: '/entry/:date',
		component: lazy(() => import('./EntryPage.jsx')),
	},
	{
		path: '/settings',
		component: lazy(() => import('./SettingsPage.jsx')),
	},
	{
		path: '*',
		component: lazy(() => import('./NotFoundPage.jsx')),
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
		<DefaultErrorBoundary>
			<Suspense fallback={<Spinner />}>
				<Router routes={routes} onNavigate={handleNavigate}>
					<Outlet />
				</Router>
			</Suspense>
		</DefaultErrorBoundary>
	);
}
