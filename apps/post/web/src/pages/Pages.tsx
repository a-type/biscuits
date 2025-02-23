import { updateApp, updateState } from '@/updateState.js';
import { Button, ErrorBoundary, H1, P, Spinner } from '@a-type/ui';
import { ReloadButton } from '@biscuits/client';
import { Link, makeRoutes, Outlet, Router } from '@verdant-web/react-router';
import { lazy, Suspense, useCallback } from 'react';
import { HomePage } from './HomePage.jsx';

const routes = makeRoutes([
	{
		path: '/',
		index: true,
		component: HomePage,
	},
	{
		path: '/settings',
		component: lazy(() => import('./SettingsPage.jsx')),
	},
	{
		path: '/posts/:id',
		component: lazy(() => import('./PostPage.jsx')),
	},
	{
		path: '*',
		component: lazy(() => import('./NotFoundPage.jsx')),
	},
]);

export function Pages() {
	const handleNavigate = useCallback(
		(_: Location, ev: { state?: any; skipTransition?: boolean }) => {
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
					<Outlet />
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
