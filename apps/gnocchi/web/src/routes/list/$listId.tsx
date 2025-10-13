import { GroceriesPage } from '@/pages/groceries/GroceriesPage.jsx';
import { groceriesDescriptor } from '@/stores/groceries/index.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/list/$listId')({
	component: GroceriesPage,
	loader: (ctx) =>
		groceriesDescriptor.current?.items.findAll({
			index: {
				where: 'listId',
				equals: ctx.params.listId,
			},
			key: `groceries:${ctx.params.listId}`,
		}).resolved,
});
