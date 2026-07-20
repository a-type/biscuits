import NotFoundPage from '@/pages/NotFoundPage.jsx';
import { Spinner } from '@a-type/ui';
import { DefaultErrorBoundary } from '@biscuits/client';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFoundPage,
});

function RootComponent() {
	return (
		<DefaultErrorBoundary>
			<Suspense fallback={<Spinner />}>
				<Outlet />
			</Suspense>
		</DefaultErrorBoundary>
	);
}
