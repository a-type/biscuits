import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { SubscriptionPromotionContent } from '@/components/promotional/SubscriptionPromotionContent.jsx';
import { RecipeTagEditor } from '@/components/recipes/tags/RecipeTagEditor.jsx';
import { ErrorBoundary, PageRoot } from '@a-type/ui';
import { SubscriptionPromotion, TopLoader } from '@biscuits/client';
import {
	Essentials,
	GlobalErrorFallback,
	GlobalLoader,
} from '@biscuits/client/apps';
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
		z
			.object({
				showFood: z.string(),
				recipeUrl: z.string(),
				recipeSlug: z.string(),
				recipeTitle: z.string(),
			})
			.partial(),
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
		<ErrorBoundary fallback={(props) => <GlobalErrorFallback {...props} />}>
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
