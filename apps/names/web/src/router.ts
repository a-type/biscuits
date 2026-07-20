import {
	GlobalErrorFallback,
	updateApp,
	updateState,
} from '@biscuits/client/apps';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.js';
import NotFoundPage from '@/pages/NotFoundPage.jsx';

export const router = createRouter({
	routeTree,
	scrollRestoration: true,
	defaultPreload: 'intent',
	defaultErrorComponent: GlobalErrorFallback,
	defaultViewTransition: true,
	defaultNotFoundComponent: NotFoundPage,
});

router.subscribe('onBeforeNavigate', (event) => {
	if (updateState.updateAvailable && event.pathChanged) {
		console.info('Update ready to install, intercepting navigation...');
		updateApp();
		return false;
	}
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
