import { GroceriesPage } from '@/pages/groceries/GroceriesPage.jsx';
import { verdant } from '@/stores/groceries/index.js';
import { PageContent } from '@a-type/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/list/$listId')({
	component: GroceriesPage,
	loader: (ctx) =>
		verdant.items.findAll({
			index: {
				where: 'listId',
				equals: ctx.params.listId,
			},
			key: `groceries:${ctx.params.listId}`,
		}).resolved,
	pendingComponent: PageContent,
	pendingMinMs: 0,
	wrapInSuspense: false,
});
