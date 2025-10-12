import { createFileRoute } from '@tanstack/react-router';
import { RecipePage } from '~/components/RecipePage.js';
import { fetchRecipe } from '~/utils/fetchRecipe.js';

// legacy support

export const Route = createFileRoute('/$planId/$slug')({
	component: RouteComponent,
	loader: ({ params }) =>
		fetchRecipe({
			data: {
				slug: params.slug,
				planId: params.planId,
			},
		}),
});

function RouteComponent() {
	const data = Route.useLoaderData();
	return <RecipePage data={data} />;
}
