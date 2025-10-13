import RecipeViewPage from '@/pages/recipe/RecipeViewPage.jsx';
import { groceriesDescriptor } from '@/stores/groceries/index.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/recipes/$slug')({
	component: RecipeViewPage,
	loader: (ctx) => {
		const slug = ctx.params.slug.split('-').pop();
		return groceriesDescriptor.current?.recipes.findOne({
			index: {
				where: 'slug',
				equals: slug,
			},
			key: `recipeBySlug:${slug}`,
		}).resolved;
	},
});
