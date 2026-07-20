import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.js';

export const router = createRouter({
	routeTree,
	scrollRestoration: true,
	defaultPreload: 'intent',
	defaultViewTransition: true,
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
