import { createMiddleware } from '@tanstack/react-start';

export const listIdMiddleware = createMiddleware().server(
	({ next, request, context }) => {
		const url = new URL(request.url);
		let listId;
		const pathSegments = url.pathname.split('/').filter(Boolean);
		if (pathSegments[0] === 'l' && pathSegments.length >= 2) {
			listId = pathSegments[1];
		} else {
			listId =
				url.searchParams.get('listId') ||
				request.headers.get('x-routed-resource') ||
				undefined;
		}

		if (!listId) {
			console.error('No list ID found in request');
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
