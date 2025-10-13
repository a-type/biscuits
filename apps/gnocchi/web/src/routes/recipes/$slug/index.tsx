import RecipeOverviewPage from '@/pages/recipe/RecipeOverviewPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/recipes/$slug/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <RecipeOverviewPage />;
}
