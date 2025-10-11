import { createMiddleware } from '@tanstack/react-start';

export const planIdMiddleware = createMiddleware().server(
	({ next, request, context }) => {
		// the list ID is either the first subdomain,
		// or attached to a query param
		const host = request.headers.get('host') || '';
		const url = new URL(request.url);
		let planId = url.searchParams.get('planId') || undefined;

		if (!planId) {
			const hostParts = host.split('.');
			if (hostParts.length > 2) {
				planId = hostParts[0];
			}
		}

		if (!planId) {
			throw new Error('No plan ID found in request');
		}

		return next({
			context: {
				...(context ?? {}),
				planId,
			},
		});
	},
);
