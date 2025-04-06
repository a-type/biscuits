import { Button, ErrorBoundary, H1, P, PageRoot, Spinner } from '@a-type/ui';
import { ReloadButton } from '@biscuits/client';
import { updateApp, updateState } from '@biscuits/client/apps';
import { Link, makeRoutes, Outlet, Router } from '@verdant-web/react-router';
import { lazy, Suspense, useCallback } from 'react';
import { HomePage } from './HomePage.jsx';

const routes = makeRoutes([
	{
		path: '/',
		exact: true,
		component: HomePage,
	},
	{
		path: '/:code',
		component: HomePage,
		exact: true,
	},
	{
		path: '/:code/:chapter',
		component: lazy(() => import('./ChapterPage.jsx')),
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
		<ErrorBoundary fallback={(props) => <ErrorFallback {...props} />}>
			<Suspense fallback={<Spinner />}>
				<Router routes={routes} onNavigate={handleNavigate}>
					<PageRoot>
						<Outlet />
					</PageRoot>
				</Router>
			</Suspense>
		</ErrorBoundary>
	);
}

function ErrorFallback({ clearError }: { clearError: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center p-4">
			<div className="flex flex-col items-start justify-center gap-4 max-w-content">
				<H1>Something went wrong</H1>
				<P>
					Sorry about this. The app has crashed. You can try refreshing, but if
					that doesn't work, use the button below to report the issue.
				</P>
				<Button asChild>
					<Link to="/" onClick={clearError}>
						Go Home
					</Link>
				</Button>
				<ReloadButton />
			</div>
		</div>
	);
}
