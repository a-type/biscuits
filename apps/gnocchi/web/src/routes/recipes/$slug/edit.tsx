import RecipeEditPage from '@/pages/recipe/RecipeEditPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/recipes/$slug/edit')({
	component: RouteComponent,
});

function RouteComponent() {
	return <RecipeEditPage />;
}
