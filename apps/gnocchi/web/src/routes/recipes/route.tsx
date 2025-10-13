import RecipesWrapper from '@/pages/recipe/RecipesWrapper.jsx';
import { groceriesDescriptor } from '@/stores/groceries/index.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/recipes')({
	component: RecipesWrapper,
	loader: () =>
		groceriesDescriptor.current?.recipes.findAllInfinite({
			index: {
				where: 'updatedAt',
				order: 'desc',
			},
			pageSize: 10,
			key: 'recipes',
		}).resolved,
});
