import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { SubscriptionPromotionContent } from '@/components/promotional/SubscriptionPromotionContent.jsx';
import { RecipeTagEditor } from '@/components/recipes/tags/RecipeTagEditor.jsx';
import { PageRoot } from '@a-type/ui';
import { SubscriptionPromotion } from '@biscuits/client';
import { GlobalErrorFallback, GlobalLoader } from '@biscuits/client/apps';
import {
	Outlet,
	createRootRoute,
	stripSearchParams,
} from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
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
	pendingComponent: GlobalLoader,
	errorComponent: (props) => <GlobalErrorFallback clearError={props.reset} />,
});

function RootComponent() {
	return (
		<PageRoot>
			<Outlet />
			<NavBar />
			<RecipeTagEditor />
			<FoodDetailDialog />
			<SubscriptionPromotion>
				<SubscriptionPromotionContent />
			</SubscriptionPromotion>
		</PageRoot>
	);
}
