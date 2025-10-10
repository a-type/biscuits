import { createMiddleware } from '@tanstack/react-start';

export const listIdMiddleware = createMiddleware().server(
	({ next, request, context }) => {
		// the list ID is either the first subdomain,
		// or attached to a query param
		const host = request.headers.get('host') || '';
		const url = new URL(request.url);
		let listId = url.searchParams.get('listId') || undefined;

		if (!listId) {
			const hostParts = host.split('.');
			if (hostParts.length > 2) {
				listId = hostParts[0];
			}
		}

		if (!listId) {
			throw new Error('No list ID found in request');
		}

		return next({
			context: {
				...(context ?? {}),
				listId,
			},
		});
	},
);
