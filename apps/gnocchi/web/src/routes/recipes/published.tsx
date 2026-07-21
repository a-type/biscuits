import PublishedRecipesPage from '@/pages/recipe/PublishedRecipesPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/recipes/published')({
	component: PublishedRecipesPage,
});
