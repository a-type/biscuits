import { GroceriesPage } from '@/pages/groceries/GroceriesPage.jsx';
import { groceriesDescriptor } from '@/stores/groceries/index.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: GroceriesPage,
	loader: async () => {
		await Promise.all([
			groceriesDescriptor.current?.items.findAll({
				key: 'groceries:all',
			}).resolved,
			groceriesDescriptor.current?.categories.findAll({
				key: 'groceryCategories',
			}),
		]);
		console.log('loaded');
	},
});
