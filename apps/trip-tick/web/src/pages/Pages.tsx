import { PageRoot } from '@a-type/ui';
import { updateApp, updateState } from '@biscuits/client/apps';
import { Outlet, Router, makeRoutes } from '@verdant-web/react-router';
import { useCallback } from 'react';
import { lazyWithPreload as lazy } from 'react-lazy-with-preload';

// dynamically import pages that may not be visited
const ListPage = lazy(() => import('./ListPage.jsx'));
const TripsPage = lazy(() => import('./TripsPage.jsx'));
const TripPage = lazy(() => import('./TripPage.jsx'));

const routes = makeRoutes([
	{
		path: '/',
		component: TripsPage,
		exact: true,
		onVisited() {
			TripPage.preload();
		},
	},
	{
		path: '/trips/:tripId',
		component: TripPage,
	},
	{
		path: '/lists/:listId',
		component: ListPage,
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
		<PageRoot>
			<Router routes={routes} onNavigate={handleNavigate}>
				<Outlet />
			</Router>
		</PageRoot>
	);
}
