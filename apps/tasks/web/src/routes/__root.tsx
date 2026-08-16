import { router } from '@/router.js';
import { ErrorBoundary, PageRoot } from '@a-type/ui';
import { SubscriptionPromotion, TopLoader } from '@biscuits/client';
import {
	Essentials,
	GlobalErrorFallback,
	GlobalLoader,
} from '@biscuits/client/apps';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<ErrorBoundary fallback={(props) => <GlobalErrorFallback {...props} />}>
			<Suspense fallback={<GlobalLoader />}>
				<TopLoader router={router} />
				<PageRoot>
					<Outlet />
				</PageRoot>
				<Essentials />
				<SubscriptionPromotion>
					TODO: Add a subscription promotion component here, or remove this if
					not needed.
				</SubscriptionPromotion>
			</Suspense>
		</ErrorBoundary>
	);
}
