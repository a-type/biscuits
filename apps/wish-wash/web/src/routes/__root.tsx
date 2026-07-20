import { ShareTargetListPicker } from '@/components/shareTarget/ShareTargetListPicker.jsx';
import { ErrorBoundary, Spinner } from '@a-type/ui';
import { GlobalErrorFallback } from '@biscuits/client/apps';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<ErrorBoundary fallback={(props) => <GlobalErrorFallback {...props} />}>
			<Suspense fallback={<Spinner />}>
				<Outlet />
				<Suspense>
					<ShareTargetListPicker />
				</Suspense>
			</Suspense>
		</ErrorBoundary>
	);
}
