import { SuperBar } from '@/components/superBar/SuperBar.jsx';
import { PageContent, PageRoot, Spinner } from '@a-type/ui';
import { DefaultErrorBoundary } from '@biscuits/client';
import { updateApp, updateState } from '@biscuits/client/apps';
import { makeRoutes, Outlet, Router } from '@verdant-web/react-router';
import { lazy, Suspense, useCallback } from 'react';
import { HomePage } from './HomePage.jsx';

const routes = makeRoutes([
	{
		path: '/settings',
		component: lazy(() => import('./SettingsPage.jsx')),
	},
	{
		path: '/',
		component: () => (
			<PageRoot>
				<PageContent>
					<Suspense>
						<SuperBar />
					</Suspense>
					<Suspense
						fallback={
							<Spinner className="absolute left-1/2 top-1/2 translate--1/2" />
						}
					>
						<Outlet />
					</Suspense>
				</PageContent>
			</PageRoot>
		),
		children: [
			{
				path: '/',
				index: true,
				component: HomePage,
			},
			{
				path: '/people/:id',
				component: lazy(() => import('./PersonPage.jsx')),
			},
			{
				path: '*',
				component: lazy(() => import('./NotFoundPage.js')),
			},
		],
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
			<Suspense
				fallback={
					<Spinner className="absolute left-1/2 top-1/2 translate--1/2" />
				}
			>
				<Router routes={routes} onNavigate={handleNavigate}>
					<Outlet />
				</Router>
			</Suspense>
		</DefaultErrorBoundary>
	);
}
