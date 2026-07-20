import ErrorPage from '@/pages/ErrorPage.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import { ErrorBoundary } from '@a-type/ui';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFoundPage,
});

function RootComponent() {
	return (
		<ErrorBoundary fallback={<ErrorPage />}>
			<Suspense>
				<Outlet />
			</Suspense>
		</ErrorBoundary>
	);
}
