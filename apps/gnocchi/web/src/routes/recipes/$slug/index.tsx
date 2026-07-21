import RecipeOverviewPage from '@/pages/recipe/RecipeOverviewPage.jsx';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';

export const Route = createFileRoute('/recipes/$slug/')({
	component: RouteComponent,
	validateSearch: zodValidator(
		z
			.object({
				firstTimeScanFlow: z.boolean(),
				skipWelcome: z.boolean(),
			})
			.partial(),
	),
});

function RouteComponent() {
	return <RecipeOverviewPage />;
}
