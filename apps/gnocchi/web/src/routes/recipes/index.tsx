import RecipesPage from '@/pages/recipe/RecipesPage.jsx';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';

export const Route = createFileRoute('/recipes/')({
	component: RecipesPage,
	validateSearch: zodValidator(
		z
			.object({
				tag: z.string().default(''),
				food: z.string().default(''),
				search: z.string().default(''),
			})
			.partial(),
	),
});
