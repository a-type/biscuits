import { createFileRoute } from '@tanstack/react-router';
import { RecipePage } from '~/components/RecipePage.js';
import { fetchRecipe } from '~/utils/fetchRecipe.js';

export const Route = createFileRoute('/$slug')({
	component: RouteComponent,
	loader: ({ params }) => {
		return fetchRecipe({ data: { slug: params.slug } });
	},
});

function RouteComponent() {
	const data = Route.useLoaderData();
	return <RecipePage data={data} />;
}
