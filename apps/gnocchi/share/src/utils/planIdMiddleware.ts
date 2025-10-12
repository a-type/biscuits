import { createMiddleware } from '@tanstack/react-start';

export const planIdMiddleware = createMiddleware().server(
	({ next, request, context }) => {
		const url = new URL(request.url);
		let planId;
		const pathSegments = url.pathname.split('/').filter(Boolean);
		if (pathSegments.length >= 3 && pathSegments[0] === 'p') {
			planId = pathSegments[1];
		} else if (pathSegments.length === 2) {
			planId = pathSegments[0];
		} else {
			const headerResource = request.headers.get('x-routed-resource') || '';
			planId = url.searchParams.get('planId') || headerResource || '';
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
