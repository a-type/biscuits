import RecipesWrapper from '@/pages/recipe/RecipesWrapper.jsx';
import { verdant } from '@/stores/groceries/index.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/recipes')({
	component: RecipesWrapper,
	loader: () =>
		verdant.recipes.findAllInfinite({
			index: {
				where: 'updatedAt',
				order: 'desc',
			},
			pageSize: 10,
			key: 'recipes',
		}).resolved,
});
