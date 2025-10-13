import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import { BugButton } from '@/components/menu/BugButton.jsx';
import { LinkButton } from '@/components/nav/Link.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { SubscriptionPromotionContent } from '@/components/promotional/SubscriptionPromotionContent.jsx';
import { RecipeTagEditor } from '@/components/recipes/tags/RecipeTagEditor.jsx';
import {
	ReloadButton,
	useHadRecentError,
} from '@/components/sync/ReloadButton.jsx';
import { GlobalLoader } from '@/GlobalLoader.jsx';
import { groceriesDescriptor } from '@/stores/groceries/index.js';
import { ErrorBoundary, H1, P, PageRoot } from '@a-type/ui';
import {
	SubscribedOnly,
	SubscriptionPromotion,
	TopLoader,
} from '@biscuits/client';
import { Essentials, ResetToServer } from '@biscuits/client/apps';
import {
	Outlet,
	createRootRoute,
	stripSearchParams,
} from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { Suspense } from 'react';
import z from 'zod';

export const Route = createRootRoute({
	component: RootComponent,
	validateSearch: zodValidator(
		z.object({
			showFood: z.string().default(''),
		}),
	),
	search: {
		middlewares: [
			stripSearchParams({
				showFood: '',
			}),
		],
	},
});

function RootComponent() {
	return (
		<ErrorBoundary fallback={(props) => <ErrorFallback {...props} />}>
			<Suspense fallback={<GlobalLoader />}>
				<TopLoader />
				<PageRoot>
					<Outlet />
					<NavBar />
				</PageRoot>
				<Essentials />
				<RecipeTagEditor />
				<FoodDetailDialog />
				<SubscriptionPromotion>
					<SubscriptionPromotionContent />
				</SubscriptionPromotion>
			</Suspense>
		</ErrorBoundary>
	);
}

function ErrorFallback({ clearError }: { clearError: () => void }) {
	const hadRecentError = useHadRecentError();

	return (
		<div className="flex flex-col items-center justify-center p-4">
			<div className="flex flex-col items-start justify-center gap-4 max-w-content">
				<H1>Something went wrong</H1>
				<P>
					Sorry about this. The app has crashed.{' '}
					{hadRecentError
						? `Looks like refreshing didn't work either... I recommend reporting a bug using the button below.`
						: `You can try refreshing, but if
					that doesn't work, use the button below to report the issue.`}
				</P>
				<LinkButton to="/" onClick={clearError}>
					Go Home
				</LinkButton>
				<ReloadButton />
				<BugButton />
				{hadRecentError && (
					<SubscribedOnly>
						<ResetToServer clientDescriptor={groceriesDescriptor} />
					</SubscribedOnly>
				)}
			</div>
		</div>
	);
}
