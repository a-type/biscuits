import { SubscriptionPromotionContent } from '@/components/promotional/SubscriptionPromotionContent.jsx';
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
				<TopLoader />
				<PageRoot>
					<Outlet />
				</PageRoot>
				<Essentials />
				<SubscriptionPromotion>
					<SubscriptionPromotionContent />
				</SubscriptionPromotion>
			</Suspense>
		</ErrorBoundary>
	);
}
