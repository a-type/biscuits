import { SuperBar } from '@/components/superBar/SuperBar.jsx';
import { updateApp, updateState } from '@/updateState.js';
import {
	Button,
	ErrorBoundary,
	H1,
	P,
	PageContent,
	PageRoot,
	Spinner,
} from '@a-type/ui';
import { ReloadButton } from '@biscuits/client';
import { Link, makeRoutes, Outlet, Router } from '@verdant-web/react-router';
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
					<Suspense
						fallback={
							<Spinner className="absolute left-1/2 top-1/2 translate--1/2" />
						}
					>
						<Outlet />
					</Suspense>
					<Suspense>
						<SuperBar />
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
				path: '/:any',
				component: lazy(() => import('./NotFoundPage.js')),
			},
		],
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
			<Suspense
				fallback={
					<Spinner className="absolute left-1/2 top-1/2 translate--1/2" />
				}
			>
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
