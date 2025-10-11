import { createMiddleware } from '@tanstack/react-start';

export const proxyAuthMiddleware = createMiddleware().server(
	({ next, request }) => {
		const cookieHeader = request.headers.get('cookie');
		const authHeaders = new Headers();
		if (cookieHeader) {
			authHeaders.set('cookie', cookieHeader);
		}
		return next({
			context: {
				headers: authHeaders,
			},
		});
	},
);
