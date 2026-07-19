import { GroceriesPage } from '@/pages/groceries/GroceriesPage.jsx';
import { verdant } from '@/stores/groceries/index.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: GroceriesPage,
	loader: async () => {
		await Promise.all([
			verdant.items.findAll({
				key: 'groceries:all',
			}).resolved,
			verdant.categories.findAll({
				key: 'groceryCategories',
			}),
		]);
		console.log('loaded');
	},
});
